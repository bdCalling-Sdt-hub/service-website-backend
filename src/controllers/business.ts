import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import {
  countBusinesses,
  createBusiness,
  getBusinessById,
  getBusinesses,
  updateBusiness,
} from "../services/business";
import {
  createBusinessValidation,
  getBusinessesValidation,
  getBusinessValidation,
  updateBusinessValidation,
} from "../validations/business";
import { getServiceById } from "../services/service";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { createPayment } from "../services/payment";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

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
      address,
      suburb,
      mainServiceId,
      mobile,
      name,
      postalCode,
      state,
      phone,
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
      userId: user.id,
      abn,
      address,
      suburb,
      mainServiceId,
      mobile,
      name,
      postalCode,
      state,
      phone,
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
    const { limit, page, name, postalCode, serviceId, suburb } =
      getBusinessesValidation(request);

    const totalBusinesses = await countBusinesses({
      name,
      postalCode,
      serviceId,
      suburb,
    });

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
      postalCode,
      serviceId,
      suburb,
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
      abn,
      businessId,
      about,
      facebook,
      instagram,
      license,
      mobile,
      name,
      openHour,
      phone,
      website,
      services,
      address,
      mainServiceId,
      postalCode,
      state,
      suburb,
    } = updateBusinessValidation(request);
    let cleanAbout = about;

    if (about) cleanAbout = purify.sanitize(about);

    const business = await updateBusiness(businessId, {
      abn,
      about: cleanAbout,
      facebook,
      instagram,
      license,
      mobile,
      name,
      openHour,
      phone,
      website,
      services,
      address,
      mainServiceId,
      postalCode,
      state,
      suburb,
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

export async function getBusinessController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { id } = getBusinessValidation(request);

    const business = await getBusinessById(id);

    if (!business) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Business not found",
      });
    }

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Business found",
      data: business,
    });
  } catch (error) {
    next(error);
  }
}
