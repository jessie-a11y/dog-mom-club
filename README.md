# Dog Mom Club

## Seeding Stripe Products & Prices

`scripts/seed-stripe.js` is a one-time setup script that creates all products and prices in your Stripe account based on `data/products.json` and `data/odd-dog-products.json`.

### What it creates

| Product | Prices created |
|---|---|
| Beagle's Bagels | Single ($8), 2-Pack ($15) |
| Lucy's Loopies | Single ($8), 2-Pack ($15) |
| Winston's Woofles | Single ($8), 2-Pack ($15) |
| Moose's Medley | Single ($12), 2-Pack ($20) |
| The Odd Dog (book) | Standard ($15), Signed & Personalized ($20) |
| Dog Mom Box | Monthly subscription ($29/mo) |

### How to run

1. Make sure your `.env.local` has a valid `STRIPE_SECRET_KEY`.
2. Run the script, passing the key inline or sourcing your env file:

```bash
# Option A — pass the key inline
STRIPE_SECRET_KEY=sk_test_... node scripts/seed-stripe.js

# Option B — source your .env.local first (requires dotenv or similar)
export $(grep -v '^#' .env.local | xargs) && node scripts/seed-stripe.js
```

3. The script prints all created Price IDs at the end. Copy them into `.env.local`.

> **Note:** This script creates new products/prices each time it runs. Only run it once per Stripe account (test or live). If you need to re-run, delete the previously created products in the Stripe Dashboard first.
