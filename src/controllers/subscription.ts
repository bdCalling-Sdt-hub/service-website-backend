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

    return response.json({
      success: true,
      status: 200,
      message: "Subscription created successfully",
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
      return response.json(
        responseBuilder(false, 404, "No subscriptions found")
      );
    }

    const skip = (page - 1) * limit;
    const subscriptions = await getSubscriptions({ limit, skip });

    return response.json(
      responseBuilder(true, 200, "Subscriptions fetched", subscriptions)
    );
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

    return response.json(
      responseBuilder(true, 200, "Subscription updated", subscription)
    );
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

    return response.json(
      responseBuilder(true, 200, "Subscription deleted", subscription)
    );
  } catch (error) {
    next(error);
  }
}
