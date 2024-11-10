import type { Request, Response, NextFunction } from "express";
import {
  getExistingPromotion,
  createPromotion,
  deletePromotion,
  getPromotionById,
  countPromotions,
  getPromotions,
} from "../services/promotion";
import responseBuilder from "../utils/responseBuilder";
import {
  createPromotionValidation,
  deletePromotionValidation,
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

    const { limit, page } = getPromotionValidation(request);

    const totalPromotions = await countPromotions({
      businessId: user.business.id,
    });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalPromotions,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;

    const promotions = await getPromotions({
      limit,
      skip,
      businessId: user.business.id,
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
