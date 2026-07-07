import type { FastifyReply, FastifyRequest } from 'fastify'
import { config, isProduction } from './config.js'
import { hashValue, pool, randomToken } from './db.js'

export interface SessionUser {
  id: string
  displayName: string | null
  status: string
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')

  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    return `+7${digits.slice(1)}`
  }

  if (digits.length === 10) {
    return `+7${digits}`
  }

  throw new Error('Некорректный номер телефона')
}

export async function issueSession(reply: FastifyReply, userId: string) {
  const rawToken = randomToken(32)
  const tokenHash = hashValue(rawToken)
  const expiresAt = new Date(Date.now() + config.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)

  await pool.query(
    `
      insert into sessions (user_id, session_token_hash, ip, user_agent, expires_at)
      values ($1, $2, $3, $4, $5)
    `,
    [
      userId,
      tokenHash,
      reply.request.ip,
      reply.request.headers['user-agent'] ?? null,
      expiresAt,
    ],
  )

  reply.setCookie(config.COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    domain: config.COOKIE_DOMAIN,
    expires: expiresAt,
  })
}

export async function clearSession(reply: FastifyReply, token?: string) {
  if (token) {
    await pool.query(
      'update sessions set revoked_at = now() where session_token_hash = $1 and revoked_at is null',
      [hashValue(token)],
    )
  }

  reply.clearCookie(config.COOKIE_NAME, {
    path: '/',
    domain: config.COOKIE_DOMAIN,
  })
}

export async function getSessionUser(request: FastifyRequest) {
  const token = request.cookies[config.COOKIE_NAME]
  if (!token) return null

  const result = await pool.query<SessionUser>(
    `
      select u.id, u.display_name as "displayName", u.status
      from sessions s
      join users u on u.id = s.user_id
      where s.session_token_hash = $1
        and s.revoked_at is null
        and s.expires_at > now()
        and u.deleted_at is null
      limit 1
    `,
    [hashValue(token)],
  )

  return result.rows[0] ?? null
}
