import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { cookies } from 'next/headers'

function isAuthenticated() {
  const token = cookies().get('admin_token')?.value
  return token === process.env.ADMIN_PASSWORD
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()
  const orders = await sql`
    SELECT * FROM orders ORDER BY created_at DESC
  `

  return NextResponse.json(orders)
}
