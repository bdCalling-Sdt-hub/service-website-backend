import app from "./src/app";
import http from "http";
import { eventConstructor, getCustomerById } from "./src/services/stripe";
import { getSubscriptionByPriceId } from "./src/services/subscription";
import { createPayment } from "./src/services/payment";
import { updateBusiness } from "./src/services/business";
import { sendInvoiceEmail } from "./src/services/mail";

const PORT = process.env.PORT || 9000;

const server = http.createServer();

server.on("request", (req, res) => {
  if (req.url === "/webhook" && req.method === "POST") {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      res.statusCode = 400;
      res.end("Webhook Error");
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const event = eventConstructor(body, signature as string);

        if (event.type !== "invoice.payment_succeeded") {
          res.statusCode = 400;
          return res.end("invalid event type");
        }

        const priceId = (event.data.object as any).lines.data[0].price.id;

        const subscription = await getSubscriptionByPriceId(priceId);

        if (!subscription) {
          res.statusCode = 400;
          return res.end("subscription not found");
        }

        const customerId = (event.data.object as any).customer;

        const stripeCustomer = (await getCustomerById(customerId)) as any;

        const businessId = (stripeCustomer as any).metadata.businessId;

        await createPayment({
          subscriptionId: subscription.id,
          businessId,
          amount: subscription.price,
          expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          transactionId: (event.data.object as any).payment_intent,
        });

        await updateBusiness(businessId, {
          subscriptionEndAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (event.data.object.hosted_invoice_url) {
          await sendInvoiceEmail(
            stripeCustomer.email,
            event.data.object.hosted_invoice_url
          );
        }
        return res.end("Webhook Received");
      } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.end("Webhook Error");
      }
    });
  } else {
    app(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});