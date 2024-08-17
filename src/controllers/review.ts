import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import { countReviews, createReview, getReviews } from "../services/review";
import { getBusinessById } from "../services/business";
import {
  createReviewValidation,
  getReviewsValidation,
} from "../validations/review";
import paginationBuilder from "../utils/paginationBuilder";

export async function createReviewController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { businessId, rating, message } = createReviewValidation(request);

    const business = await getBusinessById(businessId);

    if (!business) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Business not found",
      });
    }

    const review = await createReview({
      businessId,
      userId: user.id,
      rating,
      message,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Review created",
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReviewsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { businessId, limit, page } = getReviewsValidation(request);

    const totalReviews = await countReviews({ businessId });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalReviews,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;

    const reviews = await getReviews({ businessId, limit, skip });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Reviews found",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
}
