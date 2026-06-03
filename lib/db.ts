import { neon } from '@neondatabase/serverless'

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!)
  return sql
}

export type OrderStatus = 'pending' | 'fulfilled' | 'shipped'

export interface Order {
  id: number
  stripe_session_id: string
  customer_email: string
  customer_name: string | null
  items: OrderItem[]
  personalization_notes: string | null
  total: string
  shipping_address: ShippingAddress | null
  status: OrderStatus
  tracking_number: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  name: string
  quantity: number
  price: string
}

export interface ShippingAddress {
  line1: string | null
  line2: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
}
