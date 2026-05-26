'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'

export default function SuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="card p-10 md:p-14">
        <div className="text-6xl mb-6">🐾</div>
        <h1 className="font-serif text-4xl text-brown-dark">Order Confirmed!</h1>
        <p className="mt-4 text-brown-warm leading-relaxed">
          Thank you so much for your order — your pup is going to love it! You'll receive a confirmation email shortly with your order details and tracking info.
        </p>

        <div className="mt-8 p-4 bg-cream-100 rounded-xl text-sm text-brown-warm">
          <p>Questions about your order? <Link href="/contact" className="text-rose-dusty underline">Contact us</Link> and we'll be happy to help.</p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-primary">Shop More Treats</Link>
          <Link href="/subscribe" className="btn-secondary">Subscribe & Save</Link>
        </div>
      </div>
    </div>
  )
}
