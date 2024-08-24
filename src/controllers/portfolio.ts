import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  countPortfolios,
  createPortfolio,
  deletePortfolio,
  getPortfolioById,
  getPortfolios,
} from "../services/portfolio";
import {
  createPortfolioValidation,
  deletePortfolioValidation,
  getPortfoliosValidation,
} from "../validations/portfolio";
import paginationBuilder from "../utils/paginationBuilder";

export async function createPortfolioController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { name, image } = createPortfolioValidation(request);

    if (!user.business) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Business not found",
      });
    }

    // const payment = await getLastPaymentByUserId(user.id);

    // if (!payment) {
    //   return responseBuilder(response, {
    //     ok: false,
    //     statusCode: 400,
    //     message: "You need to subscribe to a plan to add a portfolio",
    //   });
    // }

    const portfolio = await createPortfolio({
      businessId: user.business.id,
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

export async function deletePortfolioController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { id } = deletePortfolioValidation(request);

    const portfolio = await getPortfolioById(id);

    if (!portfolio) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Portfolio not found",
      });
    }

    if (portfolio.businessId !== user.business.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You are not authorized to delete this portfolio",
      });
    }

    await deletePortfolio(id);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Portfolio deleted",
    });
  } catch (error) {
    next(error);
  }
}
