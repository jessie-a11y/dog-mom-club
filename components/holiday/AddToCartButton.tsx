'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import type { Product } from '@/lib/types'

export default function AddToCartButton({ product, className = '' }: { product: Product; className?: string }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const variant = product.variants[0]

  function add() {
    addItem({
      productId: product.id,
      name: product.name,
      price: variant.price ?? product.price,
      image: product.image,
      variant,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={add}
      className={`min-h-[48px] rounded-full bg-holiday-pine px-5 py-3 font-semibold text-holiday-snow hover:bg-[#2a5242] transition-colors ${className}`}
    >
      {added ? 'Added to cart' : 'Add to cart'}
    </button>
  )
}
