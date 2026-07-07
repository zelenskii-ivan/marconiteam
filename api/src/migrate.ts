import { pool, runMigrations } from './db.js'

runMigrations()
  .then(async () => {
    console.log('API migrations completed')
    await pool.end()
  })
  .catch(async (error) => {
    console.error(error)
    await pool.end()
    process.exit(1)
  })
