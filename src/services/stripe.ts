import Stripe from "stripe";
import "dotenv/config";
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

if (!stripe_secret_key) {
  throw new Error("Stripe secret key is not provided");
}

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const frontEndUrl = process.env.FRONTEND_URL;

if (!endpointSecret) {
  throw new Error("Stripe webhook secret is not provided");
}

if (!frontEndUrl) {
  throw new Error("Frontend URL is not provided");
}

const stripe = new Stripe(stripe_secret_key);

export function createCheckoutSession({
  priceId,
  costumerId,
  businessId,
  subscriptionId,
}: {
  priceId: string;
  costumerId: string;
  businessId: string;
  subscriptionId: string;
}) {
  return stripe.checkout.sessions.create({
    success_url: `${frontEndUrl}/dashboard`,
    cancel_url: `${frontEndUrl}/cancel`,
    payment_method_types: ["au_becs_debit"],
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: 1 }],
    customer: costumerId,
    metadata: {
      businessId,
      subscriptionId,
    },
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
  minimumStart?: number;
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
      price,
      minimumStart: minimumStart ?? 0,
      benefits: JSON.stringify(benefits),
    },
  });
}

export function getCustomers(email: string) {
  return stripe.customers.list({ email });
}

export function createCustomer({
  email,
  businessId,
}: {
  email: string;
  businessId: string;
}) {
  return stripe.customers.create({
    email,
    metadata: {
      businessId,
    },
  });
}

export function createProduct(name: string) {
  return stripe.products.create({ name });
}

export function getSubscriptionByCustomerId(customerId: string) {
  return stripe.subscriptions.list({ customer: customerId });
}

export function eventConstructor(body: Buffer | string, signature: string) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    endpointSecret as string
  );
}

export function getCustomerById(id: string) {
  return stripe.customers.retrieve(id);
}

export function cancelSubscription(id: string) {
  return stripe.subscriptions.cancel(id);
}

export function updateSubscription({
  stripeSubscriptionId,
  priceId,
}: {
  stripeSubscriptionId: string;
  priceId: string;
}) {
  return stripe.subscriptions.update(stripeSubscriptionId, {
    items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });
}
