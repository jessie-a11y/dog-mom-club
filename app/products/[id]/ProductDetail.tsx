'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import ProductCard from '@/components/ProductCard'
import type { Product, ProductVariant, SizeOption } from '@/lib/types'

interface Props {
  product: Product
  related: Product[]
}

export default function ProductDetail({ product, related }: Props) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(
    product.sizeOptions?.[0] ?? null
  )
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const displayPrice = selectedVariant.price ?? product.price

  // Compose the variant label to include size when applicable: "Mini, Single Bag"
  const cartVariant: ProductVariant = selectedSize
    ? { ...selectedVariant, label: `${selectedSize.label}, ${selectedVariant.label}` }
    : selectedVariant

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: product.image,
      variant: cartVariant,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-brown-warm mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-rose-dusty transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-rose-dusty transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-brown-dark">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image + nutrition thumbnail */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-200">
            {product.badge && (
              <span className="absolute top-4 left-4 z-10 bg-rose-dusty text-white text-xs font-semibold px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {product.nutritionLabel && (
            <div className="flex items-start gap-3">
              <button
                onClick={() => setLightboxOpen(true)}
                className="group flex flex-col items-center gap-1.5 focus:outline-none"
                aria-label="View nutrition label"
              >
                <div className="relative w-[120px] h-[160px] rounded-xl overflow-hidden border-2 border-cream-300 group-hover:border-rose-dusty transition-colors bg-white">
                  <Image
                    src={product.nutritionLabel}
                    alt={`${product.name} nutrition label`}
                    fill
                    className="object-cover object-top"
                    sizes="120px"
                  />
                </div>
                <span className="text-xs font-medium text-rose-dusty group-hover:underline">
                  View Nutrition Label
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="font-serif text-4xl text-brown-dark">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold text-rose-dusty">${displayPrice.toFixed(2)}</p>

          <p className="mt-5 text-brown-warm leading-relaxed">{product.description}</p>

          {/* Ingredients */}
          <div className="mt-6 p-4 rounded-xl bg-cream-100 border border-cream-300">
            <p className="text-xs font-semibold uppercase tracking-wider text-brown-soft mb-2">Ingredients</p>
            {product.ingredients.includes('|') ? (
              <ul className="space-y-1">
                {product.ingredients.split('|').map((part) => {
                  const [label, ...rest] = part.trim().split(':')
                  return (
                    <li key={label} className="text-sm text-brown-warm">
                      <span className="font-medium text-brown-dark">{label.trim()}:</span>{' '}
                      {rest.join(':').trim()}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-brown-warm">{product.ingredients}</p>
            )}
          </div>

          {/* Size selector — only for products with sizeOptions */}
          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-brown-dark mb-3">Select size:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors duration-150 ${
                      selectedSize?.value === size.value
                        ? 'border-rose-dusty bg-rose-pale text-rose-dusty'
                        : 'border-cream-300 text-brown-warm hover:border-rose-light'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="mt-3 text-sm italic text-brown-warm bg-cream-100 border border-cream-300 rounded-xl px-4 py-2.5">
                  {selectedSize.hint}
                </p>
              )}
            </div>
          )}

          {/* Variants */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-brown-dark mb-3 capitalize">
              Select quantity:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.value}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors duration-150 ${
                    selectedVariant.value === variant.value
                      ? 'border-rose-dusty bg-rose-pale text-rose-dusty'
                      : 'border-cream-300 text-brown-warm hover:border-rose-light'
                  }`}
                >
                  {variant.label}
                  {variant.oz && (
                    <span className="ml-1 text-xs opacity-70">({variant.oz})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-brown-dark mb-3">Quantity:</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-9 w-9 rounded-full border-2 border-cream-300 text-brown-warm hover:border-rose-dusty transition-colors flex items-center justify-center text-lg"
              >
                −
              </button>
              <span className="w-8 text-center font-medium text-brown-dark">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="h-9 w-9 rounded-full border-2 border-cream-300 text-brown-warm hover:border-rose-dusty transition-colors flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 py-4 text-base"
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <Link href="/cart" className="btn-outline flex-1 py-4 text-base text-center">
              View Cart
            </Link>
          </div>

          {/* Perks */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: '🌿', text: 'All-natural ingredients' },
              { icon: '🐾', text: 'Vet approved recipe' },
              { icon: '📦', text: 'Free shipping on orders $35+' },
              { icon: '💛', text: 'Made in small batches' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-brown-warm">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="section-title mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Nutrition label lightbox */}
      {lightboxOpen && product.nutritionLabel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
              <p className="text-sm font-semibold text-brown-dark">Nutrition &amp; Ingredients</p>
              <button
                onClick={() => setLightboxOpen(false)}
                className="text-brown-light hover:text-brown-dark transition-colors text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <Image
                src={product.nutritionLabel}
                alt={`${product.name} nutrition label`}
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
