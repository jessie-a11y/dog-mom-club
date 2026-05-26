#!/usr/bin/env node
/**
 * seed-stripe.js
 * One-time setup script to create all Stripe products and prices
 * from data/products.json and data/odd-dog-products.json.
 *
 * Usage: node scripts/seed-stripe.js
 * Requires STRIPE_SECRET_KEY in your environment (copy from .env.local).
 */

const path = require("path");
const Stripe = require("stripe").default ?? require("stripe");
const products = require("../data/products.json");
const oddDogProducts = require("../data/odd-dog-products.json");

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error(
    "Error: STRIPE_SECRET_KEY is not set.\n" +
      "Run: STRIPE_SECRET_KEY=sk_test_... node scripts/seed-stripe.js"
  );
  process.exit(1);
}

const stripe = new Stripe(secretKey, { apiVersion: "2023-10-16" });

// Collect created price IDs for final output
const createdPrices = {};

async function createProduct(name, description, image) {
  const params = { name, description };
  // Only attach image if it's a full URL (not a local /images/... path)
  if (image && image.startsWith("http")) {
    params.images = [image];
  }
  const product = await stripe.products.create(params);
  console.log(`  Created product: ${product.name} (${product.id})`);
  return product;
}

async function createPrice(productId, unitAmount, currency, nickname, recurring = null) {
  const params = {
    product: productId,
    unit_amount: unitAmount,
    currency,
    nickname,
  };
  if (recurring) {
    params.recurring = recurring;
  }
  const price = await stripe.prices.create(params);
  console.log(`    Created price [${nickname}]: ${price.id}  ($${(unitAmount / 100).toFixed(2)}${recurring ? "/mo" : ""})`);
  return price;
}

async function seedTreats() {
  console.log("\n--- Dog Treats ---");

  for (const item of products) {
    // Skip the Dog Mom Box subscription — handled separately
    if (item.id === "dog-mom-box") continue;

    console.log(`\nProduct: ${item.name}`);
    const product = await createProduct(item.name, item.description, item.image);
    const key = item.id.replace(/-/g, "_");

    for (const variant of item.variants) {
      const amountCents = Math.round(variant.price * 100);
      const nickname = `${item.name} — ${variant.label}`;
      const price = await createPrice(product.id, amountCents, "usd", nickname);

      if (variant.value === "single") {
        createdPrices[`${key}_single`] = price.id;
      } else if (variant.value === "2-pack") {
        createdPrices[`${key}_2pack`] = price.id;
      }
    }
  }
}

async function seedOddDog() {
  console.log("\n--- The Odd Dog Book ---");

  for (const item of oddDogProducts) {
    console.log(`\nProduct: ${item.name}`);
    const product = await createProduct(item.name, item.description, item.image);
    const key = item.id.replace(/-/g, "_");

    for (const variant of item.variants) {
      const amountCents = Math.round(variant.price * 100);
      const nickname = `${item.name} — ${variant.label}`;
      const price = await createPrice(product.id, amountCents, "usd", nickname);

      if (variant.value === "standard") {
        createdPrices[`${key}_standard`] = price.id;
      } else if (variant.value === "signed") {
        createdPrices[`${key}_signed`] = price.id;
      }
    }
  }
}

async function seedSubscription() {
  console.log("\n--- Dog Mom Box Subscription ---");

  const subscriptionProduct = products.find((p) => p.id === "dog-mom-box");

  let product;
  if (subscriptionProduct) {
    product = await createProduct(
      subscriptionProduct.name,
      subscriptionProduct.description,
      subscriptionProduct.image
    );
  } else {
    // Fallback if not in products.json
    product = await createProduct(
      "Dog Mom Box",
      "Monthly curated subscription box for dog moms.",
      null
    );
  }

  const price = await createPrice(
    product.id,
    2900,
    "usd",
    "Dog Mom Box — Monthly Subscription",
    { interval: "month" }
  );

  createdPrices["dog_mom_box_monthly"] = price.id;
}

async function main() {
  console.log("Seeding Stripe products and prices...");
  console.log(`Using key: ${secretKey.slice(0, 8)}...`);

  await seedTreats();
  await seedOddDog();
  await seedSubscription();

  console.log("\n============================================================");
  console.log("All done! Copy these into your .env.local:\n");

  // Treats — single prices
  console.log("# Treat single prices");
  for (const [key, id] of Object.entries(createdPrices)) {
    if (key.endsWith("_single")) {
      const envKey = `NEXT_PUBLIC_STRIPE_PRICE_${key.toUpperCase()}`;
      console.log(`${envKey}=${id}`);
    }
  }

  console.log("\n# Treat 2-pack prices");
  for (const [key, id] of Object.entries(createdPrices)) {
    if (key.endsWith("_2pack")) {
      const envKey = `NEXT_PUBLIC_STRIPE_PRICE_${key.toUpperCase()}`;
      console.log(`${envKey}=${id}`);
    }
  }

  console.log("\n# The Odd Dog book prices");
  for (const [key, id] of Object.entries(createdPrices)) {
    if (key.includes("odd_dog") || key.includes("the_odd")) {
      const envKey = `NEXT_PUBLIC_STRIPE_PRICE_${key.toUpperCase()}`;
      console.log(`${envKey}=${id}`);
    }
  }

  console.log("\n# Subscription");
  if (createdPrices.dog_mom_box_monthly) {
    console.log(`STRIPE_SUBSCRIPTION_PRICE_ID=${createdPrices.dog_mom_box_monthly}`);
  }

  console.log("\n# Raw price ID map (for reference):");
  console.log(JSON.stringify(createdPrices, null, 2));
  console.log("============================================================\n");
}

main().catch((err) => {
  console.error("Stripe seed failed:", err.message);
  process.exit(1);
});
