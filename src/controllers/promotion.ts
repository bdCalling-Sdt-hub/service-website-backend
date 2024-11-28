import type { Request, Response, NextFunction } from "express";
import {
  getExistingPromotion,
  createPromotion,
  deletePromotion,
  getPromotionById,
  countPromotions,
  getPromotion,
  countTotalPromotions,
  getAllPromotions,
  approvePromotion,
} from "../services/promotion";
import responseBuilder from "../utils/responseBuilder";
import {
  approvePromotionValidation,
  createPromotionValidation,
  deletePromotionValidation,
  getAllPromotionsValidation,
  getPromotionValidation,
} from "../validations/promotion";
import paginationBuilder from "../utils/paginationBuilder";

export async function createPromotionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { discount, endAt, startAt, title } =
      createPromotionValidation(request);

    if (!user.business?.id) {
      return response.status(400).json({
        ok: false,
        message: "you are not a business user",
      });
    }

    const isPromotionExists = await getExistingPromotion({
      businessId: user.business.id,
      startDate: new Date(),
    });

    if (isPromotionExists) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "You already have an existing promotion",
      });
    }

    const promotion = await createPromotion({
      businessId: user.business.id,
      title,
      discount,
      startAt,
      endAt,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Promotion created successfully",
      data: promotion,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePromotionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { id } = deletePromotionValidation(request);

    const promotion = await getPromotionById(id);

    if (!promotion) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Promotion not found",
      });
    }

    if (promotion.businessId !== user?.business?.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You are not allowed to delete this promotion",
      });
    }

    await deletePromotion(id);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getPromotionsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (!user.business?.id) {
      return response.status(400).json({
        ok: false,
        message: "you are not a business user",
      });
    }

    const promotion = await getPromotion({
      businessId: user.business.id,
    });

    if (!promotion) {
      return response.status(404).json({
        ok: false,
        statusCode: 404,
        message: "Promotion not found",
        data: null,
        pagination: {},
      });
    }

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Promotions fetched successfully",
      data: promotion,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllPromotionsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, limit } = getAllPromotionsValidation(request);

    const totalPromotions = await countTotalPromotions();

    const pagination = paginationBuilder({
      currentPage: page,
      totalData: totalPromotions,
      limit,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;

    const promotions = await getAllPromotions({
      skip,
      take: limit,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Promotions fetched successfully",
      data: promotions,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function approvePromotionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { id } = approvePromotionValidation(request);

    const promotion = await getPromotionById(id);

    if (!promotion) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Promotion not found",
      });
    }

    await approvePromotion(id);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Promotion approved successfully",
    });
  } catch (error) {
    next(error);
  }
}
