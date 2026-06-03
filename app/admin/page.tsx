'use client'

import { useEffect, useState } from 'react'
import type { Order, OrderStatus } from '@/lib/db'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  fulfilled: 'Fulfilled',
  shipped: 'Shipped',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  fulfilled: 'bg-blue-100 text-blue-800',
  shipped: 'bg-green-100 text-green-800',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [trackingInputs, setTrackingInputs] = useState<Record<number, string>>({})

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthed(true)
      fetchOrders()
    } else {
      setLoginError('Incorrect password')
    }
  }

  async function fetchOrders() {
    setLoading(true)
    const res = await fetch('/api/admin/orders')
    if (res.status === 401) {
      setAuthed(false)
      setLoading(false)
      return
    }
    if (res.ok) {
      const data = await res.json()
      setOrders(data)
      setAuthed(true)
    }
    setLoading(false)
  }

  async function updateOrder(id: number, updates: { status?: OrderStatus; tracking_number?: string }) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (authed === null || (authed === false && orders.length === 0 && !loading)) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <form onSubmit={login} className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-amber-900">Admin Login</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg py-2 transition"
          >
            Sign in
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-amber-900">Orders</h1>
          <button
            onClick={fetchOrders}
            className="text-sm text-amber-700 hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading && <p className="text-amber-700">Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <p className="text-amber-700">No orders yet.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-amber-900">{order.customer_name ?? order.customer_email}</p>
                  <p className="text-sm text-gray-500">{order.customer_email}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <p className="text-lg font-bold text-amber-800 mt-1">${order.total}</p>
                </div>
              </div>

              {/* Items */}
              <ul className="text-sm text-gray-700 mb-3 space-y-1">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${item.price}</span>
                  </li>
                ))}
              </ul>

              {/* Personalization notes */}
              {order.personalization_notes && (
                <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                  <span className="font-semibold">Note:</span> {order.personalization_notes}
                </p>
              )}

              {/* Shipping address */}
              {order.shipping_address && (
                <p className="text-sm text-gray-500 mb-3">
                  {order.shipping_address.line1}{order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''},{' '}
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
              )}

              {/* Tracking number */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Tracking number"
                  value={trackingInputs[order.id] ?? order.tracking_number ?? ''}
                  onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <button
                  onClick={() => updateOrder(order.id, { tracking_number: trackingInputs[order.id] ?? '' })}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
                >
                  Save
                </button>
              </div>

              {/* Status buttons */}
              <div className="flex gap-2 flex-wrap">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrder(order.id, { status: 'fulfilled' })}
                    className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-4 py-1.5 rounded-lg transition"
                  >
                    Mark Fulfilled
                  </button>
                )}
                {(order.status === 'pending' || order.status === 'fulfilled') && (
                  <button
                    onClick={() => updateOrder(order.id, { status: 'shipped' })}
                    className="text-sm bg-green-100 hover:bg-green-200 text-green-800 font-medium px-4 py-1.5 rounded-lg transition"
                  >
                    Mark Shipped
                  </button>
                )}
                {order.status !== 'pending' && (
                  <button
                    onClick={() => updateOrder(order.id, { status: 'pending' })}
                    className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium px-4 py-1.5 rounded-lg transition"
                  >
                    Reset to Pending
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
