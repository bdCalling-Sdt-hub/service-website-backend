import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  countReviews,
  countTotalStar,
  createReview,
  getReviews,
  totalStartByGroup,
} from "../services/review";
import { getBusinessById } from "../services/business";
import {
  createReviewValidation,
  getAllReviewsValidation,
  getReviewsValidation,
} from "../validations/review";
import paginationBuilder from "../utils/paginationBuilder";
import {
  getCommunicationById,
  updateCommunication,
} from "../services/communication";

export async function createReviewController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { rating, message, communicationId, discount } =
      createReviewValidation(request);

    const communication = await getCommunicationById(communicationId);

    if (!communication) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Communication not found",
      });
    }

    if (!communication.userId) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "This communication is not for review",
      });
    }

    if (communication.status === "PENDING") {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You are not allowed to review this communication now",
      });
    }

    if (communication.status === "REVIEWED") {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You are already review this communication",
      });
    }

    const review = await createReview({
      businessId: communication.businessId,
      userId: communication.userId,
      rating,
      message,
      discount,
    });

    await updateCommunication({
      businessId: communication.businessId,
      userId: communication.userId,
      status: "SENDED",
      newStatus: "REVIEWED",
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
    const groupRatings = await totalStartByGroup(businessId);

    const ratings = [5, 4, 3, 2, 1].map((rating) => {
      return {
        star: rating,
        total:
          groupRatings.find((group) => group.rating === rating)?._count
            .rating ?? 0,
      };
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Reviews found",
      data: { reviews, ratings },
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTotalStarController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (!user.businessId) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Create a business first",
      });
    }

    const totalReviews = await countTotalStar(user.businessId);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Total star",
      data: totalReviews,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllReviewsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page } = getAllReviewsValidation(request);

    const totalReviews = await countReviews({});

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

    const reviews = await getReviews({ limit, skip });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Reviews found",
      data: reviews,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}
