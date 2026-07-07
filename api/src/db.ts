import { randomBytes, createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { config } from './config.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  ssl: config.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

export function randomToken(size = 32) {
  return randomBytes(size).toString('base64url')
}

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sqlDir = path.resolve(__dirname, '../sql')

export async function runMigrations() {
  await pool.query(`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `)

  const files = (await readdir(sqlDir)).filter((file) => file.endsWith('.sql')).sort()

  for (const file of files) {
    const alreadyApplied = await pool.query('select 1 from schema_migrations where id = $1', [file])
    if (alreadyApplied.rowCount) continue

    const sql = await readFile(path.join(sqlDir, file), 'utf8')
    const client = await pool.connect()

    try {
      await client.query('begin')
      await client.query(sql)
      await client.query('insert into schema_migrations (id) values ($1)', [file])
      await client.query('commit')
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }
}
