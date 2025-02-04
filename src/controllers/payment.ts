import type { Request, Response, NextFunction } from "express";
import {
  createCheckoutSessionValidation,
  createPaymentValidation,
  getPaymentChartValidation,
  getPaymentsValidation,
  paymentReportValidation,
  upgradePlanValidation,
} from "../validations/payment";
import {
  calculateTotalEarnings,
  countPayments,
  createPayment,
  getPayments,
  getPaymentsByYear,
  totalEarnings,
} from "../services/payment";
import { getSubscriptionById } from "../services/subscription";
import Stripe from "stripe";
import responseBuilder from "../utils/responseBuilder";
import { createNotification } from "../services/notification";
import { getAdmin } from "../services/user";
import paginationBuilder from "../utils/paginationBuilder";
import {
  createCheckoutSession,
  createCustomer,
  eventConstructor,
  getCustomers,
  getPriceById,
  getSubscriptionByCustomerId,
  updateSubscription,
  // getSubscriptionByUserId,
} from "../services/stripe";
import { countTotalStar } from "../services/review";

export async function createPaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    // const { account_number, bsb_number, priceId } =
    //   createPaymentValidation(request);
    const user = request.user;

    if (!user.business?.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Register as a business to subscribe to a plan",
      });
    }

    // const price = await stripe.prices.retrieve(priceId);

    // if (!price) {
    //   return responseBuilder(response, {
    //     ok: false,
    //     statusCode: 404,
    //     message: "Subscription not found",
    //   });
    // }

    // // Create a Stripe customer
    // const customer = await stripe.customers.create({
    //   email: user.email,
    //   metadata: {
    //     userId: user.id,
    //     businessId: user.business.id,
    //   },
    // });

    // // Create a BECS Direct Debit payment method
    // const paymentMethod = await stripe.paymentMethods.create({
    //   type: "au_becs_debit",
    //   au_becs_debit: {
    //     bsb_number,
    //     account_number,
    //   },
    //   billing_details: {
    //     name: user.firstName + " " + user.lastName, // Make sure this is provided
    //     email: user.email,
    //     address: {
    //       city: "Sydney",
    //       country: "AU",
    //       line1: "123 Main Street",
    //       postal_code: "2000",
    //       state: "NSW",
    //     },
    //     phone: user.business?.mobile,
    //   },
    // });

    // // Attach the payment method to the customer
    // await stripe.paymentMethods.attach(paymentMethod.id, {
    //   customer: customer.id,
    // });

    // //payment_intent.succeeded

    // // Set the payment method as default
    // await stripe.customers.update(customer.id, {
    //   invoice_settings: {
    //     default_payment_method: paymentMethod.id,
    //   },
    // });

    // // Create a subscription with BECS Direct Debit as the payment method
    // const subscription = await stripe.subscriptions.create({
    //   customer: customer.id,
    //   items: [{ price: price.id }],
    //   // payment_behavior: 'default_incomplete',
    //   expand: ["latest_invoice.payment_intent"],
    // });

    createPayment({
      businessId: user.business.id,
      amount: 412,
      subscriptionId: "sdfafj",
      expireAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      transactionId: "sdfafj",
    });

    // Notify the user of successful subscription
    sendNotifications({
      subscriptionName: "price.metadata.name",
      userId: user.id,
      userName: user.name,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Subscription created and payment method set up successfully",
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

    const event = eventConstructor(request.body, sig);

    console.log(event);

    // Handle the event
    switch (event.type) {
      case "invoice.payment_succeeded":
        const invoice = event.data.object;
        console.log(invoice);
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

export async function getTotalEarningsController(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const earnings = await totalEarnings();

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Total earnings fetched",
      data: earnings._sum,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentChartController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { year } = getPaymentChartValidation(request);

    const payments = await getPaymentsByYear(year);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = months.map((month) => {
      const monthPayments = payments.filter(
        (payment) => payment.createdAt.getMonth() === months.indexOf(month)
      );

      const totalAmount = monthPayments.reduce(
        (total, payment) => total + payment.amount,
        0
      );

      return {
        month,
        totalAmount,
      };
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Payment chart fetched",
      data: chartData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (user.type !== "ADMIN" && !user.business?.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Register as a business to view payments",
      });
    }

    const { limit, page, endDate, startDate } = getPaymentsValidation(request);

    const totalPayments = await countPayments({
      businessId: user.type === "ADMIN" ? undefined : user.business.id,
      startDate,
      endDate,
    });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalPayments,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const payments = await getPayments({
      limit,
      skip,
      businessId: user.type === "ADMIN" ? undefined : user.business.id,
      startDate,
      endDate,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Payments fetched",
      data: payments,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCheckoutSessionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (!user.business?.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Register as a business to subscribe to a plan",
      });
    }

    const { subscriptionId, cancelUrl, successUrl } =
      createCheckoutSessionValidation(request);

    const subscription = await getSubscriptionById(subscriptionId);

    if (!subscription || subscription.isDeleted) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    if (
      subscription.minimumStart &&
      subscription.minimumStart > (await countTotalStar(user.business.id))
    ) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message:
          "You need to have at least " +
          subscription.minimumStart +
          " stars to subscribe to this plan",
      });
    }

    const price = await getPriceById(subscription.priceId);

    if (!price) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    let customer;

    const existingCustomers = await getCustomers(user.email);

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];

      const subscriptions = await getSubscriptionByCustomerId(customer.id);

      if (subscriptions.data.length > 0) {
        return responseBuilder(response, {
          ok: false,
          statusCode: 409,
          message: "Customer already has a subscription",
        });
      }
    } else {
      customer = await createCustomer({
        email: user.email,
        businessId: user.business.id,
      });
    }

    const session = await createCheckoutSession({
      priceId: price.id,
      costumerId: customer.id,
      businessId: user.business.id,
      subscriptionId,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Subscription session created",
      data: { url: session.url },
    });
  } catch (error) {
    next(error);
  }
}

export async function paymentReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { startDate, endDate, businessId } = paymentReportValidation(request);

    const payments = await getPayments({
      startDate,
      endDate,
      businessId,
      limit: 100,
      skip: 0,
    });

    const totalAmount = await calculateTotalEarnings({
      businessId,
      startDate,
      endDate,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Payment report fetched",
      data: {
        payments,
        totalAmount: totalAmount._sum.amount ?? 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function upgradePlanController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { subscriptionId } = upgradePlanValidation(request);

    if (!user.business?.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Register as a business to upgrade your plan",
      });
    }

    const subscription = await getSubscriptionById(subscriptionId);

    if (!subscription) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    const existingCustomers = await getCustomers(user.email);

    if (existingCustomers.data.length === 0) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Subscribe to a plan first",
      });
    }

    const customer = existingCustomers.data[0];

    const subscriptions = await getSubscriptionByCustomerId(customer.id);

    if (subscriptions.data.length === 0) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Subscribe to a plan first",
      });
    }

    await updateSubscription({
      priceId: subscription.priceId,
      stripeSubscriptionId: subscriptions.data[0].id,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Plan upgraded successfully",
    });
  } catch (error) {
    next(error);
  }
}
