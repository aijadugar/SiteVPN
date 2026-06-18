import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Set STRIPE_SECRET_KEY before running this script.")
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const products = [
  { key: "FREE", name: "SiteVPN Free", amount: 0 },
  { key: "PRO", name: "SiteVPN Pro", amount: 900 },
  { key: "BUSINESS", name: "SiteVPN Business", amount: 2900 },
]

for (const productConfig of products) {
  const product = await stripe.products.create({
    name: productConfig.name,
    metadata: { plan: productConfig.key.toLowerCase() },
  })

  if (productConfig.amount > 0) {
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productConfig.amount,
      currency: "usd",
      recurring: { interval: "month" },
      metadata: { plan: productConfig.key.toLowerCase() },
    })

    console.log(`${productConfig.key}: product=${product.id} price=${price.id}`)
  } else {
    console.log(`${productConfig.key}: product=${product.id} no price needed`)
  }
}
