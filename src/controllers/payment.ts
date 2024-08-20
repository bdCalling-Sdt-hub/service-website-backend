import type { Request, Response, NextFunction } from "express";
import { createPaymentValidation } from "../validations/payment";
import { createPayment } from "../services/payment";
import { getSubscriptionById } from "../services/subscription";
import Stripe from "stripe";
import responseBuilder from "../utils/responseBuilder";
import { createNotification } from "../services/notification";
import { getAdmin } from "../services/user";
import dotenv from "dotenv";

dotenv.config();

const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

if (!stripe_secret_key) {
  throw new Error("Stripe secret key is not provided");
}

const stripe = new Stripe(stripe_secret_key);

export async function createPaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { account_number, bsb_number, priceId } =
      createPaymentValidation(request);
    const user = request.user;

    if (!user.business?.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Register as a business to subscribe to a plan",
      });
    }

    const price = await stripe.prices.retrieve(priceId);

    if (!price) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    const customer = await stripe.customers.create({
      name: user.name,
      email: user.email,
    });

    const paymentMethod = await stripe.paymentMethods.create({
      type: "au_becs_debit",
      au_becs_debit: {
        bsb_number,
        account_number,
      },
      billing_details: {
        name: "Customer Name",
        email: "customer@example.com",
      },
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_settings: {
        payment_method_types: ["au_becs_debit"], // Specify BECS as the payment method
      },
      expand: ["latest_invoice.payment_intent"],
    });

    sendNotifications({
      subscriptionName: price.metadata.name,
      userId: user.id,
      userName: user.name,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Payment successful",
    });
  } catch (error) {
    next(error);
  }
}

async function sendNotifications({
  subscriptionName,
  userId,
  userName,
}: {
  subscriptionName: string;
  userId: string;
  userName: string;
}) {
  await createNotification({
    userId: userId,
    message: `You have successfully subscribed to ${subscriptionName} subscription`,
  });

  const admin = await getAdmin();

  if (admin) {
    await createNotification({
      userId: admin.id,
      message: `${userName} has successfully subscribed to ${subscriptionName} subscription`,
    });
  }
}

export async function webhookController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const sig = request.headers["stripe-signature"] as string;
    const endpointSecret = "your-webhook-signing-secret";

    const event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      endpointSecret
    );

    // Handle the event
    switch (event.type) {
      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice payment succeeded for ${invoice.customer}`);
        // Update your database to mark the subscription as active, etc.
        break;
      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice payment failed for ${failedInvoice.customer}`);
        // Handle the failed payment (e.g., notify the customer, retry payment)
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    next(error);
  }
}
