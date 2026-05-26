'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/components/CartProvider'
import type { OddDogProduct, ProductVariant } from '@/lib/types'

export default function OddDogProductCard({ product }: { product: OddDogProduct }) {
  const { addItem } = useCart()
  const hasVariants = product.variants && product.variants.length > 0
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? product.variants![0] : null
  )
  const [personalization, setPersonalization] = useState('')
  const [added, setAdded] = useState(false)

  const isSigned = selectedVariant?.value === 'signed'
  const displayPrice = selectedVariant?.price ?? product.price

  function handleAddToCart() {
    if (!selectedVariant || displayPrice == null) return
    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: product.image,
      variant: selectedVariant,
      quantity: 1,
      note: isSigned && personalization.trim() ? personalization.trim() : undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-cream-200 hover:shadow-md transition-shadow duration-300">
      {/* Cover image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-6">
        {/* Title + credits */}
        <h3 className="font-serif text-xl text-brown-dark">{product.name}</h3>
        <p className="mt-1 text-xs text-brown-warm font-medium">By {product.author}</p>
        <p className="mt-0.5 text-xs text-brown-light">
          Illustrated by {product.illustrator} &middot; Edited by {product.editor}
        </p>

        <p className="mt-4 text-sm text-brown-warm leading-relaxed">{product.description}</p>

        {hasVariants ? (
          <div className="mt-6 space-y-4">
            {/* Variant picker */}
            <div className="space-y-2">
              {product.variants!.map((variant) => (
                <button
                  key={variant.value}
                  onClick={() => {
                    setSelectedVariant(variant)
                    if (variant.value !== 'signed') setPersonalization('')
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors duration-150 ${
                    selectedVariant?.value === variant.value
                      ? 'border-rose-dusty bg-rose-pale/40 text-brown-dark'
                      : 'border-cream-300 text-brown-warm hover:border-rose-light'
                  }`}
                >
                  <span>{variant.label}</span>
                  <span className="font-semibold">${variant.price!.toFixed(2)}</span>
                </button>
              ))}
            </div>

            {/* Personalization input — only for signed */}
            {isSigned && (
              <div>
                <label className="block text-xs font-semibold text-brown-dark mb-1.5">
                  Personalization request
                </label>
                <textarea
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                  placeholder="To Max, with love from Odd 🐾"
                  rows={2}
                  maxLength={200}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm text-brown-dark placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-rose-dusty/30 focus:border-rose-dusty transition resize-none"
                />
                <p className="mt-1 text-xs text-brown-light">
                  Your message will be handwritten inside the cover.
                </p>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={isSigned && !personalization.trim()}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>

            {isSigned && !personalization.trim() && (
              <p className="text-xs text-center text-brown-light -mt-2">
                Enter your personalization message above to continue.
              </p>
            )}
          </div>
        ) : (
          <button
            disabled
            className="mt-6 w-full py-2.5 rounded-full border-2 border-rose-light text-rose-dusty text-sm font-medium opacity-70 cursor-not-allowed"
          >
            Coming Soon
          </button>
        )}
      </div>
    </div>
  )
}
