import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  countReferrals,
  createReferral,
  getReferrals,
  getRefers,
} from "../services/referrals";
import {
  createReferralValidation,
  getReferralsValidation,
} from "../validations/referals";
import { getBusinessById } from "../services/business";
import paginationBuilder from "../utils/paginationBuilder";
import { countUsers } from "../services/user";

export async function createReferralController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { businessId, email, name, phone } =
      createReferralValidation(request);

    const business = await getBusinessById(businessId);

    if (!business) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Business not found",
      });
    }

    await createReferral({
      userId: user.id,
      businessId,
      name,
      email,
      phone,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Referral created",
    });
  } catch (error) {
    next(error);
  }
}

export async function getReferralsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (!user.business.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "Forbidden",
      });
    }

    const { limit, page } = getReferralsValidation(request);

    const totalReferrals = await countReferrals(user.business.id);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalReferrals,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const referrals = await getReferrals({
      businessId: user.business.id,
      limit,
      skip,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Referrals fetched",
      data: referrals,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRefersController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const totalUsers = await countUsers({});
    const { limit, page } = getReferralsValidation(request);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalUsers,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;

    const users = await getRefers({
      limit,
      skip,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Users fetched",
      data: users,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}
