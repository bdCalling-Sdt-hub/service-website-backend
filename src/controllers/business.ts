import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import {
  countBusinesses,
  createBusiness,
  getBusinessById,
  getBusinesses,
  businessReport,
  updateBusiness,
  businessCommunications,
} from "../services/business";
import {
  businessReportValidation,
  createBusinessValidation,
  getBusinessesValidation,
  getBusinessValidation,
  sendReportValidation,
  updateBusinessValidation,
} from "../validations/business";
import { getServiceById } from "../services/service";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { createCheckoutSession, createCustomer } from "../services/stripe";
import { getDefaultSubscription } from "../services/subscription";
import { sendMonthlyReportEmail } from "../services/mail";
import { countTotalStar, getBestsProvidersOfLastMonth } from "../services/review";

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
    const {
      limit,
      page,
      name,
      latitude,
      longitude,
      serviceId,
      endDate,
      startDate,
    } = getBusinessesValidation(request);

    const totalBusinesses = await countBusinesses({
      name,
      serviceId,
      startDate,
      endDate,
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
      startDate,
      endDate,
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
      accountName,
      accountNumber,
      bsbNumber,
      bankName,
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
      accountName,
      accountNumber,
      bsbNumber,
      bankName,
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

export async function businessReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const {
      startDate,
      endDate,
      businessName,
      suburb,
      active,
      serviceId,
      subscriptionId,
      workStatus,
    } = businessReportValidation(request);

    const report = await businessReport({
      startDate,
      endDate,
      businessName,
      suburb,
      active,
      serviceId,
      subscriptionId,
      workStatus,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Report fetched",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendReportController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { startDate, endDate } = sendReportValidation(request);

    sendMails({ startDate, endDate });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Start sending report",
    });
  } catch (error) {
    next(error);
  }
}

async function sendMails({
  startDate,
  endDate,
  skip = 0,
}: {
  startDate: Date;
  endDate: Date;
  skip?: number;
}) {
  const report = await businessCommunications({
    startDate,
    endDate,
    skip,
    take: 5,
  });

  if (!report.length) return;

  for (const business of report) {
    sendMonthlyReportEmail({
      email: business.user.email,
      businessOwnerName: business.user.firstName + " " + business.user.lastName,
      endDate,
      startDate,
      communications: business.Communications.map((communication) => ({
        name:
          communication.user?.firstName && communication.user.lastName
            ? communication.user.firstName + " " + communication.user.lastName
            : "Anonymous",
        email: communication.user?.email ?? "Anonymous",
        type: communication.type,
        createdAt: communication.createdAt,
      })),
    });
  }
}

export async function getTotalStar(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (!user.business.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Create a business first",
      });
    }

    const totalStar = await countTotalStar(user.business.id);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Total star",
      data: { totalStar },
    });
  } catch (error) {
    next(error);
  }
}


export async function getBestsProviders(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const reviews = await getBestsProvidersOfLastMonth();

    console.log(reviews);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Bests providers",
      data: reviews
    });
  } catch (error) {
    next(error);
  }
}