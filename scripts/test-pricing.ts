// Quick sanity check for bundle pricing: npx tsx scripts/test-pricing.ts
import { priceCart } from '../lib/pricing'

function check(label: string, items: Parameters<typeof priceCart>[0], expectedCents: number) {
  const r = priceCart(items)
  const ok = r.subtotalCents === expectedCents && r.invalid.length === 0
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${r.subtotalCents} (expected ${expectedCents})`)
  if (!ok) process.exitCode = 1
}

check('1 bag', [{ productId: 'beagles-bagels', variantValue: 'large', quantity: 1 }], 900)
check('2 same bag', [{ productId: 'beagles-bagels', variantValue: 'large', quantity: 2 }], 1600)
check('mix and match', [
  { productId: 'beagles-bagels', variantValue: 'small', quantity: 1 },
  { productId: 'winstons-woofles', variantValue: 'large', quantity: 1 },
], 1600)
check('3 bags + medley', [
  { productId: 'beagles-bagels', variantValue: 'large', quantity: 2 },
  { productId: 'graffles', variantValue: 'single', quantity: 1 },
  { productId: 'mooses-medley', variantValue: 'single', quantity: 1 },
], 1600 + 900 + 1200)
check('2 medleys', [{ productId: 'mooses-medley', variantValue: 'single', quantity: 2 }], 2000)
check('3 medleys', [{ productId: 'mooses-medley', variantValue: 'single', quantity: 3 }], 3200)
check('medley does not pair with $9 bag', [
  { productId: 'mooses-medley', variantValue: 'single', quantity: 1 },
  { productId: 'graffles', variantValue: 'single', quantity: 1 },
], 2100)
check('advent boxes no bundle', [
  { productId: 'nutcracker-advent-box', variantValue: 'box', quantity: 1 },
  { productId: 'odd-dog-advent-box', variantValue: 'box', quantity: 1 },
  { productId: 'kc-dogs-advent-box', variantValue: 'box', quantity: 1 },
], 4500)
check('odd dog book still sells', [{ productId: 'the-odd-dog-book', variantValue: 'signed', quantity: 1 }], 2000)

const bad = priceCart([{ productId: 'lucys-loopies', variantValue: 'single', quantity: 1 }])
console.log(`${bad.invalid.length === 1 ? 'PASS' : 'FAIL'}  Lucy's Loopies rejected`)
if (bad.invalid.length !== 1) process.exitCode = 1
