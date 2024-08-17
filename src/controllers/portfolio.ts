import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  countPortfolios,
  createPortfolio,
  getPortfolios,
} from "../services/portfolio";
import {
  createPortfolioValidation,
  getPortfoliosValidation,
} from "../validations/portfolio";
import { getBusinessById } from "../services/business";
import paginationBuilder from "../utils/paginationBuilder";
import { getLastPaymentByUserId } from "../services/payment";

export async function createPortfolioController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { name, businessId, image } = createPortfolioValidation(request);

    const business = await getBusinessById(businessId);

    if (!business) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Business not found",
      });
    }

    const payment = await getLastPaymentByUserId(user.id);

    if (!payment) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "You need to subscribe to a plan to add a portfolio",
      });
    }

    if (user.id !== business.userId) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You are not allowed to add portfolio",
      });
    }

    const portfolio = await createPortfolio({
      businessId,
      image,
      name,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Portfolio created",
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPortfoliosController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { businessId, limit, page } = getPortfoliosValidation(request);

    const totalPortfolios = await countPortfolios(businessId);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalPortfolios,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const portfolios = await getPortfolios({ businessId, limit, skip });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Portfolios retrieved",
      data: portfolios,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}
