import Stripe from "stripe";
import "dotenv/config";
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

if (!stripe_secret_key) {
  throw new Error("Stripe secret key is not provided");
}

const stripe = new Stripe(stripe_secret_key);

export function createCheckoutSession({
  priceId,
  costumerId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  costumerId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_method_types: ["au_becs_debit"],
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: 1 }],
    customer: costumerId,
  });
}

export function getPriceById(id: string) {
  return stripe.prices.retrieve(id);
}

export function createPrice({
  price,
  productId,
  name,
  benefits,
  minimumStart,
}: {
  price: number;
  productId: string;
  name: string;
  benefits: string[];
  minimumStart: number;
}) {
  return stripe.prices.create({
    unit_amount: price * 100, // Convert to cents
    currency: "aud",
    recurring: {
      interval: "month",
    },
    product: productId,
    metadata: {
      name,
      minimumStart,
      price,
      benefits: JSON.stringify(benefits),
    },
  });
}

export function getCustomers(email: string) {
  return stripe.customers.list({ email });
}

export function createCustomer(email: string) {
  return stripe.customers.create({ email });
}

export function createProduct(name: string) {
  return stripe.products.create({ name });
}

export function getSubscriptionByCustomerId(userId: string) {
  return stripe.subscriptions.list({ customer: userId });
}