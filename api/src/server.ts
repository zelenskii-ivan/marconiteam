import Fastify from 'fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { z } from 'zod'
import { allowedWebOrigins, config } from './config.js'
import { clearSession, getSessionUser, issueSession, normalizePhone } from './auth.js'
import { generateOtpCode, hashValue, pool, runMigrations } from './db.js'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

const authStartSchema = z.object({
  channel: z.enum(['sms']),
  phone: z.string().min(1),
})

const authVerifySchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().length(6),
  displayName: z.string().trim().min(1).max(120).optional(),
  marketingConsent: z.boolean().optional().default(false),
})

const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(120),
  email: z.email().optional(),
})

const addressSchema = z.object({
  label: z.string().trim().min(1).max(60),
  city: z.string().trim().min(1).max(120),
  street: z.string().trim().min(1).max(160),
  building: z.string().trim().min(1).max(40),
  entrance: z.string().trim().max(40).optional(),
  floor: z.string().trim().max(40).optional(),
  apartment: z.string().trim().max(40).optional(),
  comment: z.string().trim().max(255).optional(),
  isDefault: z.boolean().default(false),
})

const favoriteSchema = z.object({
  sku: z.string().trim().min(1).max(120),
})

const requestDeletionSchema = z.object({
  reason: z.string().trim().max(500).optional(),
})

const mutatingMethods = new Set(['POST', 'PATCH', 'PUT', 'DELETE'])

async function requireUser(request: FastifyRequest, reply: FastifyReply) {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'UNAUTHORIZED' })
    return null
  }

  if (user.status !== 'active') {
    await clearSession(reply, request.cookies[config.COOKIE_NAME])
    reply.code(403).send({ error: 'ACCOUNT_BLOCKED' })
    return null
  }

  return user
}

function parseOriginHeader(headerValue?: string) {
  if (!headerValue) return null

  try {
    return new URL(headerValue).origin
  } catch {
    return null
  }
}

function getRequestOrigin(request: FastifyRequest) {
  return parseOriginHeader(request.headers.origin) ?? parseOriginHeader(request.headers.referer)
}

function isAllowedOrigin(origin: string) {
  return allowedWebOrigins.includes(origin)
}

async function audit(params: {
  actorUserId?: string | null
  targetUserId?: string | null
  action: string
  payload?: Record<string, unknown>
}) {
  await pool.query(
    `
      insert into audit_logs (actor_user_id, target_user_id, action, payload)
      values ($1, $2, $3, $4::jsonb)
    `,
    [
      params.actorUserId ?? null,
      params.targetUserId ?? null,
      params.action,
      JSON.stringify(params.payload ?? {}),
    ],
  )
}

async function registerApp() {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      })
    }

    request.log.error(error)
    return reply.code(500).send({ error: 'INTERNAL_SERVER_ERROR' })
  })

  await app.register(cookie)
  await app.register(cors, {
    origin: allowedWebOrigins,
    credentials: true,
  })
  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: false,
  })
  await app.register(rateLimit, {
    max: 20,
    timeWindow: '1 minute',
  })

  app.addHook('onRequest', async (request, reply) => {
    if (!mutatingMethods.has(request.method)) return
    if (!request.url.startsWith('/api/')) return

    const requestOrigin = getRequestOrigin(request)
    if (!requestOrigin) return

    if (!isAllowedOrigin(requestOrigin)) {
      return reply.code(403).send({ error: 'ORIGIN_NOT_ALLOWED' })
    }
  })

  app.get('/api/health', async () => ({ ok: true }))

  app.post('/api/auth/start', async (request, reply) => {
    const parsed = authStartSchema.parse(request.body)
    const phone = normalizePhone(parsed.phone)
    const code = generateOtpCode()
    const codeHash = hashValue(code)
    const expiresAt = new Date(Date.now() + config.OTP_TTL_MINUTES * 60 * 1000)

    const recentChallenge = await pool.query(
      `
        select id
        from auth_challenges
        where target = $1
          and status = 'pending'
          and created_at > now() - make_interval(secs => $2)
        order by created_at desc
        limit 1
      `,
      [phone, config.OTP_RESEND_COOLDOWN_SEC],
    )

    if (recentChallenge.rowCount) {
      return reply.code(429).send({
        error: 'OTP_COOLDOWN',
        retryAfterSec: config.OTP_RESEND_COOLDOWN_SEC,
      })
    }

    const existingUser = await pool.query<{ user_id: string }>(
      `
        select uc.user_id
        from user_contacts uc
        join users u on u.id = uc.user_id
        where uc.contact_type = 'phone'
          and uc.contact_value = $1
        limit 1
      `,
      [phone],
    )

    const created = await pool.query<{ id: string }>(
      `
        insert into auth_challenges (user_id, channel, target, code_hash, expires_at, ip, user_agent)
        values ($1, 'sms', $2, $3, $4, $5, $6)
        returning id
      `,
      [
        existingUser.rows[0]?.user_id ?? null,
        phone,
        codeHash,
        expiresAt,
        request.ip,
        request.headers['user-agent'] ?? null,
      ],
    )

    request.log.info({ phone, code }, 'Generated OTP code')

    const response: Record<string, unknown> = {
      challengeId: created.rows[0].id,
      retryAfterSec: config.OTP_RESEND_COOLDOWN_SEC,
    }

    if (config.EXPOSE_DEBUG_OTP && config.NODE_ENV !== 'production') {
      response.debugCode = code
    }

    return reply.send(response)
  })

  app.post('/api/auth/verify', async (request, reply) => {
    const parsed = authVerifySchema.parse(request.body)

    const challengeResult = await pool.query<{
      id: string
      user_id: string | null
      target: string
      code_hash: string
      expires_at: Date
      attempts: number
      status: string
    }>(
      `
        select id, user_id, target, code_hash, expires_at, attempts, status
        from auth_challenges
        where id = $1
        limit 1
      `,
      [parsed.challengeId],
    )

    const challenge = challengeResult.rows[0]
    if (!challenge || challenge.status !== 'pending') {
      return reply.code(400).send({ error: 'INVALID_CHALLENGE' })
    }

    if (challenge.expires_at.getTime() < Date.now()) {
      await pool.query('update auth_challenges set status = $2 where id = $1', [challenge.id, 'expired'])
      return reply.code(400).send({ error: 'OTP_EXPIRED' })
    }

    const nextAttempts = challenge.attempts + 1
    if (nextAttempts > config.OTP_MAX_ATTEMPTS) {
      await pool.query('update auth_challenges set status = $2, attempts = $3 where id = $1', [
        challenge.id,
        'cancelled',
        nextAttempts,
      ])
      return reply.code(429).send({ error: 'OTP_MAX_ATTEMPTS' })
    }

    if (hashValue(parsed.code) !== challenge.code_hash) {
      await pool.query('update auth_challenges set attempts = $2 where id = $1', [challenge.id, nextAttempts])
      return reply.code(400).send({ error: 'INVALID_CODE' })
    }

    const client = await pool.connect()

    try {
      await client.query('begin')

      let userId = challenge.user_id

      if (!userId) {
        const createdUser = await client.query<{ id: string }>(
          `
            insert into users (display_name)
            values ($1)
            returning id
          `,
          [parsed.displayName ?? null],
        )
        userId = createdUser.rows[0].id

        await client.query(
          `
            insert into user_contacts (user_id, contact_type, contact_value, is_verified, verified_at)
            values ($1, 'phone', $2, true, now())
          `,
          [userId, challenge.target],
        )
      } else if (parsed.displayName) {
        await client.query('update users set display_name = $2, updated_at = now() where id = $1', [
          userId,
          parsed.displayName,
        ])
      }

      const currentUser = await client.query<{ status: string; deleted_at: Date | null }>(
        `
          select status, deleted_at
          from users
          where id = $1
          limit 1
        `,
        [userId],
      )

      if (!currentUser.rowCount || currentUser.rows[0].status !== 'active' || currentUser.rows[0].deleted_at) {
        await client.query('rollback')
        return reply.code(403).send({ error: 'ACCOUNT_BLOCKED' })
      }

      await client.query('update auth_challenges set status = $2, attempts = $3 where id = $1', [
        challenge.id,
        'verified',
        nextAttempts,
      ])

      await client.query(
        `
          insert into consents (user_id, consent_type, document_version, granted, ip, user_agent)
          values ($1, 'personal_data', $2, true, $3, $4)
        `,
        [
          userId,
          config.PERSONAL_DATA_CONSENT_VERSION,
          request.ip,
          request.headers['user-agent'] ?? null,
        ],
      )

      await client.query(
        `
          insert into consents (user_id, consent_type, document_version, granted, ip, user_agent)
          values ($1, 'marketing', $2, $3, $4, $5)
        `,
        [
          userId,
          config.MARKETING_CONSENT_VERSION,
          parsed.marketingConsent,
          request.ip,
          request.headers['user-agent'] ?? null,
        ],
      )

      await client.query('commit')

      await issueSession(reply, userId)

      const userResult = await pool.query(
        'select id, display_name as "displayName", status from users where id = $1 limit 1',
        [userId],
      )

      await audit({
        actorUserId: userId,
        targetUserId: userId,
        action: 'auth.verify',
        payload: { channel: 'sms' },
      })

      return reply.send({ user: userResult.rows[0] })
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  })

  app.post('/api/auth/logout', async (request, reply) => {
    const token = request.cookies[config.COOKIE_NAME]
    await clearSession(reply, token)
    return reply.code(204).send()
  })

  app.get('/api/me', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const contacts = await pool.query(
      `
        select contact_type as type, contact_value as value, is_verified as "isVerified"
        from user_contacts
        where user_id = $1
        order by created_at asc
      `,
      [user.id],
    )

    return reply.send({
      user,
      contacts: contacts.rows,
    })
  })

  app.patch('/api/me', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const parsed = profileSchema.parse(request.body)
    await pool.query('update users set display_name = $2, updated_at = now() where id = $1', [
      user.id,
      parsed.displayName,
    ])

    if (parsed.email) {
      await pool.query(
        `
          insert into user_contacts (user_id, contact_type, contact_value, is_verified)
          values ($1, 'email', $2, false)
          on conflict (contact_type, contact_value) do update
          set user_id = excluded.user_id
        `,
        [user.id, parsed.email],
      )
    }

    await audit({
      actorUserId: user.id,
      targetUserId: user.id,
      action: 'profile.update',
      payload: { hasEmail: Boolean(parsed.email) },
    })

    return reply.send({ ok: true })
  })

  app.get('/api/me/orders', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const orders = await pool.query(
      `
        select id, external_order_id as "externalOrderId", total_amount as "totalAmount", currency, status, placed_at as "placedAt"
        from orders
        where user_id = $1
        order by placed_at desc
      `,
      [user.id],
    )

    return reply.send({ items: orders.rows })
  })

  app.get('/api/me/favorites', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const favorites = await pool.query(
      'select id, sku, created_at as "createdAt" from favorites where user_id = $1 order by created_at desc',
      [user.id],
    )

    return reply.send({ items: favorites.rows })
  })

  app.post('/api/me/favorites', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const parsed = favoriteSchema.parse(request.body)

    await pool.query(
      `
        insert into favorites (user_id, sku)
        values ($1, $2)
        on conflict (user_id, sku) do nothing
      `,
      [user.id, parsed.sku],
    )

    return reply.code(201).send({ ok: true })
  })

  app.delete('/api/me/favorites/:sku', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const params = z.object({ sku: z.string().min(1) }).parse(request.params)
    await pool.query('delete from favorites where user_id = $1 and sku = $2', [user.id, params.sku])
    return reply.code(204).send()
  })

  app.get('/api/me/addresses', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const addresses = await pool.query(
      `
        select id, label, city, street, building, entrance, floor, apartment, comment, is_default as "isDefault"
        from addresses
        where user_id = $1
        order by is_default desc, created_at desc
      `,
      [user.id],
    )

    return reply.send({ items: addresses.rows })
  })

  app.post('/api/me/addresses', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const parsed = addressSchema.parse(request.body)
    const client = await pool.connect()

    try {
      await client.query('begin')

      if (parsed.isDefault) {
        await client.query('update addresses set is_default = false where user_id = $1', [user.id])
      }

      const created = await client.query(
        `
          insert into addresses (user_id, label, city, street, building, entrance, floor, apartment, comment, is_default)
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          returning id
        `,
        [
          user.id,
          parsed.label,
          parsed.city,
          parsed.street,
          parsed.building,
          parsed.entrance ?? null,
          parsed.floor ?? null,
          parsed.apartment ?? null,
          parsed.comment ?? null,
          parsed.isDefault,
        ],
      )

      await client.query('commit')
      return reply.code(201).send({ id: created.rows[0].id })
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  })

  app.patch('/api/me/addresses/:id', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const params = z.object({ id: z.string().uuid() }).parse(request.params)
    const parsed = addressSchema.parse(request.body)
    const client = await pool.connect()

    try {
      await client.query('begin')

      if (parsed.isDefault) {
        await client.query('update addresses set is_default = false where user_id = $1', [user.id])
      }

      await client.query(
        `
          update addresses
          set label = $3,
              city = $4,
              street = $5,
              building = $6,
              entrance = $7,
              floor = $8,
              apartment = $9,
              comment = $10,
              is_default = $11,
              updated_at = now()
          where id = $1 and user_id = $2
        `,
        [
          params.id,
          user.id,
          parsed.label,
          parsed.city,
          parsed.street,
          parsed.building,
          parsed.entrance ?? null,
          parsed.floor ?? null,
          parsed.apartment ?? null,
          parsed.comment ?? null,
          parsed.isDefault,
        ],
      )

      await client.query('commit')
      return reply.send({ ok: true })
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  })

  app.delete('/api/me/addresses/:id', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const params = z.object({ id: z.string().uuid() }).parse(request.params)
    await pool.query('delete from addresses where id = $1 and user_id = $2', [params.id, user.id])
    return reply.code(204).send()
  })

  app.get('/api/me/consents', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const consents = await pool.query(
      `
        select id, consent_type as "consentType", document_version as "documentVersion", granted, granted_at as "grantedAt", revoked_at as "revokedAt"
        from consents
        where user_id = $1
        order by granted_at desc
      `,
      [user.id],
    )

    return reply.send({ items: consents.rows })
  })

  app.post('/api/me/privacy/export', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    await pool.query(
      `
        insert into privacy_requests (user_id, request_type, payload)
        values ($1, 'export', '{}'::jsonb)
      `,
      [user.id],
    )

    const [contacts, addresses, favorites, orders, consents] = await Promise.all([
      pool.query('select contact_type as type, contact_value as value, is_verified as "isVerified" from user_contacts where user_id = $1', [user.id]),
      pool.query('select label, city, street, building, apartment, comment, is_default as "isDefault" from addresses where user_id = $1', [user.id]),
      pool.query('select sku, created_at as "createdAt" from favorites where user_id = $1', [user.id]),
      pool.query('select external_order_id as "externalOrderId", total_amount as "totalAmount", status, placed_at as "placedAt" from orders where user_id = $1', [user.id]),
      pool.query('select consent_type as "consentType", document_version as "documentVersion", granted, granted_at as "grantedAt", revoked_at as "revokedAt" from consents where user_id = $1', [user.id]),
    ])

    return reply.send({
      exportedAt: new Date().toISOString(),
      user,
      contacts: contacts.rows,
      addresses: addresses.rows,
      favorites: favorites.rows,
      orders: orders.rows,
      consents: consents.rows,
    })
  })

  app.post('/api/me/privacy/delete', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const parsed = requestDeletionSchema.parse(request.body ?? {})

    await pool.query(
      `
        insert into privacy_requests (user_id, request_type, payload)
        values ($1, 'delete', $2::jsonb)
      `,
      [user.id, JSON.stringify(parsed)],
    )

    await audit({
      actorUserId: user.id,
      targetUserId: user.id,
      action: 'privacy.delete.requested',
      payload: parsed,
    })

    return reply.code(202).send({ ok: true })
  })

  app.post('/api/me/privacy/revoke-marketing', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    await pool.query(
      `
        insert into consents (user_id, consent_type, document_version, granted, ip, user_agent, revoked_at)
        values ($1, 'marketing', $2, false, $3, $4, now())
      `,
      [user.id, config.MARKETING_CONSENT_VERSION, request.ip, request.headers['user-agent'] ?? null],
    )

    return reply.send({ ok: true })
  })

  app.get('/api/me/privacy/requests', async (request, reply) => {
    const user = await requireUser(request, reply)
    if (!user) return

    const requests = await pool.query(
      `
        select id,
               request_type as "requestType",
               status,
               payload,
               created_at as "createdAt",
               completed_at as "completedAt"
        from privacy_requests
        where user_id = $1
        order by created_at desc
      `,
      [user.id],
    )

    return reply.send({
      items: requests.rows,
      contactEmail: config.PRIVACY_CONTACT_EMAIL,
    })
  })
}

const start = async () => {
  await runMigrations()
  await registerApp()

  await app.listen({
    host: config.HOST,
    port: config.PORT,
  })
}

start().catch((error) => {
  app.log.error(error)
  process.exit(1)
})
