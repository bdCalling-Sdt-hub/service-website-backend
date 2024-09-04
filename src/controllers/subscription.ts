import type { Request, Response, NextFunction } from "express";
import {
  createSubscriptionValidation,
  deleteSubscriptionValidation,
  getSubscriptionsValidation,
  updateSubscriptionValidation,
} from "../validations/subscription";
import {
  countSubscriptions,
  createSubscription,
  deleteSubscription,
  getSubscriptionById,
  getSubscriptions,
  updateSubscription,
} from "../services/subscription";
import paginationBuilder from "../utils/paginationBuilder";
import responseBuilder from "../utils/responseBuilder";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createPrice, createProduct } from "../services/stripe";
import { getLastPaymentByBusinessId } from "../services/payment";

dotenv.config();

const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

if (!stripe_secret_key) {
  throw new Error("Stripe secret key is not provided");
}

const stripe = new Stripe(stripe_secret_key);

export async function createSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, minimumStart, price, benefits } =
      createSubscriptionValidation(request);

    // Create a Stripe product
    const product = await createProduct(name);

    // Create a price for the product
    const priceData = await createPrice({
      price,
      productId: product.id,
      name,
      benefits,
      minimumStart,
    });

    await createSubscription({
      name,
      minimumStart,
      price,
      benefits,
      priceId: priceData.id,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Subscription created",
      data: {
        id: priceData.id,
        ...priceData.metadata,
        benefits: JSON.parse(priceData.metadata.benefits),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSubscriptionsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page } = getSubscriptionsValidation(request);

    const totalSubscriptions = await countSubscriptions();

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalSubscriptions,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    // const prices = await stripe.prices.list({
    //   active: true,
    //   expand: ["data.product"],
    // });

    // const subscriptions = prices.data.map((price) => {
    //   return {
    //     id: price.id,
    //     name: price.metadata.name,
    //     minimumStart: price.metadata.minimumStart,
    //     price: price.metadata.price,
    //     benefits: JSON.parse(price.metadata.benefits),
    //   };
    // });

    // const paymentLink = await stripe.paymentLinks.create({
    //   line_items: [
    //     {
    //       price: subscriptions[0].id,
    //       quantity: 1,
    //     },
    //   ],
    //   after_completion: {
    //     type: 'redirect',
    //     redirect: {
    //       url: 'https://your-redirect-url.com/thank-you', // Redirect after payment
    //     },
    //   },
    // });

    // console.log(paymentLink.url);

    // console.log(prices);
    // console.log(prices.data[0].product);

    const skip = (page - 1) * limit;
    const subscriptions = await getSubscriptions({ limit, skip });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Subscriptions fetched",
      data: subscriptions,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { subscriptionId, benefits, minimumStart, name, price } =
      updateSubscriptionValidation(request);

    const subscription = await updateSubscription(subscriptionId, {
      benefits,
      minimumStart,
      name,
      price,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Subscription updated",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { subscriptionId } = deleteSubscriptionValidation(request);

    const subscription = await deleteSubscription(subscriptionId);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Subscription deleted",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function currentSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (!user.business) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Business not registered",
      });
    }

    const payment = await getLastPaymentByBusinessId(user.business.id);

    if (!payment) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "No subscription found",
      });
    }

    if (payment.expireAt < new Date()) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Subscription expired",
      });
    }

    const subscription = await getSubscriptionById(payment.subscriptionId);

    if (!subscription) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Current subscription",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}
