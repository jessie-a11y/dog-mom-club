'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="font-serif text-3xl text-brown-dark mb-3">Your cart is empty</h1>
        <p className="text-brown-warm mb-8">Looks like your pup is waiting for some treats!</p>
        <Link href="/products" className="btn-primary">Shop Treats</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl text-brown-dark mb-10">Your Cart ({totalItems})</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variant.value}`}
              className="card flex gap-4 p-4"
            >
              <div className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 bg-cream-200">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-brown-dark">{item.name}</h3>
                    <p className="text-sm text-brown-warm capitalize">
                      {item.variant.type}: {item.variant.label}
                    </p>
                    {item.note && (
                      <p className="mt-1 text-xs text-brown-light italic">
                        ✍️ &ldquo;{item.note}&rdquo;
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variant.value)}
                    className="text-brown-light hover:text-rose-dusty transition-colors flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variant.value, item.quantity - 1)}
                      className="h-7 w-7 rounded-full border border-cream-300 text-brown-warm hover:border-rose-dusty transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-brown-dark">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variant.value, item.quantity + 1)}
                      className="h-7 w-7 rounded-full border border-cream-300 text-brown-warm hover:border-rose-dusty transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-brown-dark">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif text-xl text-brown-dark mb-6">Order Summary</h2>

            {/* Free shipping progress */}
            {(() => {
              const FREE_SHIPPING_THRESHOLD = 35
              const needed = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice)
              const progress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100)
              return (
                <div className="mb-5">
                  {needed > 0 ? (
                    <p className="text-xs font-medium text-brown-warm mb-2">
                      Add <span className="text-teal font-semibold">${needed.toFixed(2)}</span> more for free shipping!
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-teal mb-2">
                      You've unlocked free shipping! 🎉
                    </p>
                  )}
                  <div className="h-1.5 w-full bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )
            })()}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-brown-warm">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brown-warm">
                <span>Shipping</span>
                <span className={totalPrice >= 35 ? 'text-teal font-medium' : ''}>
                  {totalPrice >= 35 ? 'Free' : '$5.99'}
                </span>
              </div>
              <div className="pt-3 border-t border-cream-300 flex justify-between font-semibold text-brown-dark">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice >= 35 ? 0 : 5.99)).toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full mt-6 py-4"
            >
              {loading ? 'Redirecting…' : 'Checkout with Stripe'}
            </button>

            <Link
              href="/products"
              className="mt-3 w-full text-center text-sm text-rose-dusty hover:underline block"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
