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
  getSubscriptions,
  updateSubscription,
} from "../services/subscription";
import paginationBuilder from "../utils/paginationBuilder";
import responseBuilder from "../utils/responseBuilder";

export async function createSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, minimumStart, price, Benefits } =
      createSubscriptionValidation(request);

    const subscription = await createSubscription({
      name,
      minimumStart,
      price,
      Benefits,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Subscription created",
      data: subscription,
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
    const { subscriptionId, Benefits, minimumStart, name, price } =
      updateSubscriptionValidation(request);

    const subscription = await updateSubscription(subscriptionId, {
      Benefits,
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
