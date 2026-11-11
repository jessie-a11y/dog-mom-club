/**
 * Single source of truth for prices.
 *
 * Used by the cart UI (to show bundle savings) and by /api/checkout (to build
 * the Stripe session). The server never trusts prices sent from the browser:
 * it looks every item up here.
 *
 * Bundles are applied by lowering the unit price of bundled units rather than
 * with a Stripe coupon, because Stripe Checkout does not allow `discounts` and
 * `allow_promotion_codes` on the same session. This way customers can still
 * enter codes like HOLIDAY on top of bundle pricing.
 */
import products from '@/data/products.json'
import oddDogProducts from '@/data/odd-dog-products.json'
import type { BundleGroup, Product, OddDogProduct } from '@/lib/types'

export const BUNDLES: Record<BundleGroup, { size: number; priceCents: number; label: string }> = {
  pair16: { size: 2, priceCents: 1600, label: '2 for $16, mix and match' },
  pair20: { size: 2, priceCents: 2000, label: '2 for $20' },
}

export const FREE_SHIPPING_THRESHOLD_CENTS = 2900
export const STANDARD_SHIPPING_CENTS = 599

interface CatalogEntry {
  productId: string
  name: string
  image: string
  bundle?: BundleGroup
  variants: Record<string, { label: string; priceCents: number }>
}

const catalog: Record<string, CatalogEntry> = {}

for (const p of products as Product[]) {
  catalog[p.id] = {
    productId: p.id,
    name: p.name,
    image: p.image,
    bundle: p.bundle,
    variants: Object.fromEntries(
      p.variants.map((v) => [v.value, { label: v.label, priceCents: Math.round((v.price ?? p.price) * 100) }])
    ),
  }
}

for (const p of oddDogProducts as OddDogProduct[]) {
  const variants = p.variants ?? []
  catalog[p.id] = {
    productId: p.id,
    name: p.name,
    image: p.image,
    variants: Object.fromEntries(
      variants.map((v) => [v.value, { label: v.label, priceCents: Math.round((v.price ?? p.price ?? 0) * 100) }])
    ),
  }
}

export function lookup(productId: string, variantValue: string) {
  const entry = catalog[productId]
  const variant = entry?.variants[variantValue]
  if (!entry || !variant) return null
  return { ...entry, variantLabel: variant.label, unitCents: variant.priceCents }
}

export interface PricedSegment {
  quantity: number
  unitCents: number
  bundled: boolean
}

export interface PricedLine {
  productId: string
  variantValue: string
  name: string
  variantLabel: string
  image: string
  quantity: number
  regularUnitCents: number
  bundle?: BundleGroup
  segments: PricedSegment[]
  totalCents: number
  note?: string
}

export interface PricedCart {
  lines: PricedLine[]
  regularCents: number
  subtotalCents: number
  savingsCents: number
  invalid: { productId: string; variantValue: string }[]
}

export function priceCart(
  items: { productId: string; variantValue: string; quantity: number; note?: string }[]
): PricedCart {
  const invalid: PricedCart['invalid'] = []
  const lines: PricedLine[] = []

  for (const item of items) {
    const qty = Math.floor(Number(item.quantity))
    const found = lookup(item.productId, item.variantValue)
    if (!found || !Number.isFinite(qty) || qty < 1 || qty > 99) {
      invalid.push({ productId: item.productId, variantValue: item.variantValue })
      continue
    }
    lines.push({
      productId: item.productId,
      variantValue: item.variantValue,
      name: found.name,
      variantLabel: found.variantLabel,
      image: found.image,
      quantity: qty,
      regularUnitCents: found.unitCents,
      bundle: found.bundle,
      segments: [],
      totalCents: 0,
      note: item.note,
    })
  }

  // Count bundled units per group, in cart order.
  const remainingBundled: Partial<Record<BundleGroup, number>> = {}
  for (const group of Object.keys(BUNDLES) as BundleGroup[]) {
    const units = lines.filter((l) => l.bundle === group).reduce((s, l) => s + l.quantity, 0)
    remainingBundled[group] = Math.floor(units / BUNDLES[group].size) * BUNDLES[group].size
  }

  for (const line of lines) {
    if (line.bundle) {
      const b = BUNDLES[line.bundle]
      const left = remainingBundled[line.bundle] ?? 0
      const bundledQty = Math.min(left, line.quantity)
      remainingBundled[line.bundle] = left - bundledQty
      const bundledUnit = b.priceCents / b.size
      if (bundledQty > 0) line.segments.push({ quantity: bundledQty, unitCents: bundledUnit, bundled: true })
      if (line.quantity - bundledQty > 0)
        line.segments.push({ quantity: line.quantity - bundledQty, unitCents: line.regularUnitCents, bundled: false })
    } else {
      line.segments.push({ quantity: line.quantity, unitCents: line.regularUnitCents, bundled: false })
    }
    line.totalCents = line.segments.reduce((s, seg) => s + seg.quantity * seg.unitCents, 0)
  }

  const regularCents = lines.reduce((s, l) => s + l.quantity * l.regularUnitCents, 0)
  const subtotalCents = lines.reduce((s, l) => s + l.totalCents, 0)
  return { lines, regularCents, subtotalCents, savingsCents: regularCents - subtotalCents, invalid }
}

export function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}
