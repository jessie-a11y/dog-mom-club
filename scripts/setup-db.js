// Run once to create the orders table: node scripts/setup-db.js
const fs = require('fs')
const path = require('path')

// Manually load .env.local
const envFile = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}
const { neon } = require('@neondatabase/serverless')

async function main() {
  const sql = neon(process.env.DATABASE_URL)

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id                 SERIAL PRIMARY KEY,
      stripe_session_id  TEXT UNIQUE NOT NULL,
      customer_email     TEXT NOT NULL,
      customer_name      TEXT,
      items              JSONB NOT NULL DEFAULT '[]',
      personalization_notes TEXT,
      total              TEXT NOT NULL,
      shipping_address   JSONB,
      status             TEXT NOT NULL DEFAULT 'pending',
      tracking_number    TEXT,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  console.log('✅ orders table ready')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
