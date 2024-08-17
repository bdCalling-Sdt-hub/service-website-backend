import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import {
  countBusinesses,
  createBusiness,
  getBusinesses,
  updateBusiness,
} from "../services/business";
import {
  createBusinessValidation,
  getBusinessesValidation,
  updateBusinessValidation,
} from "../validations/business";
import { getServiceById } from "../services/service";

export async function createBusinessController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (user.business) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You already have a business",
      });
    }

    const {
      abn,
      about,
      license,
      mainServiceId,
      mobile,
      name,
      openHour,
      website,
      address,
      city,
      facebook,
      instagram,
      phone,
      postalCode,
      state,
      services,
    } = createBusinessValidation(request);

    const service = await getServiceById(mainServiceId);
    if (!service) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Main service is not valid",
      });
    }

    const business = await createBusiness({
      abn,
      about,
      license,
      mobile,
      name,
      openHour,
      website,
      address,
      mainServiceId,
      userId: user.id,
      city,
      facebook,
      instagram,
      phone,
      postalCode,
      state,
      services,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Business created",
      data: business,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBusinessesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page, name, address } = getBusinessesValidation(request);

    const totalBusinesses = await countBusinesses({ name, address });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalBusinesses,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;

    const businesses = await getBusinesses({
      limit,
      skip,
      name,
      address,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Businesses found",
      data: businesses,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBusinessController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const {
      businessId,
      abn,
      about,
      license,
      name,
      openHour,
      mobile,
      phone,
      facebook,
      instagram,
      website,
    } = updateBusinessValidation(request);

    const business = await updateBusiness(businessId, {
      abn,
      about,
      license,
      mobile,
      name,
      openHour,
      phone,
      facebook,
      instagram,
      website,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Business updated",
      data: business,
    });
  } catch (error) {
    next(error);
  }
}
