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
import { createCheckoutSession, createCustomer } from "../services/stripe";
import { getDefaultSubscription } from "../services/subscription";

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
      latitude,
      longitude,
      cancelUrl,
      license,
      successUrl,
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
      license,
      latitude,
      longitude,
    });

    const subscription = await getDefaultSubscription();

    if (!subscription) {
      return responseBuilder(response, {
        ok: true,
        statusCode: 201,
        message: "Business created",
        data: { business },
      });
    }

    const customer = await createCustomer({
      email: user.email,
      businessId: business.id,
    });

    const session = await createCheckoutSession({
      cancelUrl,
      successUrl,
      priceId: subscription.priceId,
      costumerId: customer.id,
      businessId: business.id,
      subscriptionId: subscription.id,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Business created",
      data: { business, url: session.url },
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
    const { limit, page, name, latitude, longitude, serviceId } =
      getBusinessesValidation(request);

    const totalBusinesses = await countBusinesses({
      name,
      latitude,
      longitude,
      serviceId,
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
      serviceId,
      latitude,
      longitude,
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
      latitude,
      longitude,
    } = updateBusinessValidation(request);

    if (businessId !== request.user.business.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You are not authorized to update this business",
      });
    }

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
      latitude,
      longitude,
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
