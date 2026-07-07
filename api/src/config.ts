import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_BASE_URL: z.string().url().default('http://localhost:5173'),
  API_CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1).default('postgres://postgres:postgres@localhost:5432/marconi'),
  COOKIE_NAME: z.string().default('marconi_session'),
  COOKIE_DOMAIN: z.string().optional(),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(30),
  OTP_TTL_MINUTES: z.coerce.number().int().positive().default(5),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  OTP_RESEND_COOLDOWN_SEC: z.coerce.number().int().positive().default(60),
  PERSONAL_DATA_CONSENT_VERSION: z.string().default('2026-07-07'),
  MARKETING_CONSENT_VERSION: z.string().default('2026-07-07'),
  PRIVACY_CONTACT_EMAIL: z.string().email().default('privacy@marconi.local'),
  SMS_PROVIDER: z.enum(['log']).default('log'),
  EXPOSE_DEBUG_OTP: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
})

export const config = envSchema.parse(process.env)

export const isProduction = config.NODE_ENV === 'production'

export const allowedWebOrigins = config.API_CORS_ORIGIN.split(',')
  .map((value) => value.trim())
  .filter(Boolean)
