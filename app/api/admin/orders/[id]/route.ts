import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { cookies } from 'next/headers'
import type { OrderStatus } from '@/lib/db'

function isAuthenticated() {
  const token = cookies().get('admin_token')?.value
  return token === process.env.ADMIN_PASSWORD
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = parseInt(params.id, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
  }

  const body = await req.json() as { status?: OrderStatus; tracking_number?: string }
  const { status, tracking_number } = body

  const validStatuses: OrderStatus[] = ['pending', 'fulfilled', 'shipped']
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const sql = getDb()

  const [updated] = await sql`
    UPDATE orders
    SET
      status          = COALESCE(${status ?? null}, status),
      tracking_number = COALESCE(${tracking_number ?? null}, tracking_number),
      updated_at      = NOW()
    WHERE id = ${id}
    RETURNING *
  `

  if (!updated) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json(updated)
}
