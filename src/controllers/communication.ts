import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import {
  createCommunicationValidation,
  getCommunicationsValidation,
  getSingleCommunicationValidation,
  updateCommunicationValidation,
} from "../validations/communication";
import {
  countCommunications,
  createCommunication,
  getCommunicationById,
  getCommunications,
  getLastCommunication,
  updateCommunication,
} from "../services/communication";
import { sendReviewEmail } from "../services/mail";
import { getUserById } from "../services/user";
import { increasePriorityIndex } from "../services/business";

export async function createCommunicationController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { message, businessId, type, userId } =
      createCommunicationValidation(request);

    let user;

    if (userId) user = await getUserById(userId);

    if (type === "MESSAGE" && !user?.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Authorization token is required",
      });
    }

    const lastCommunication = await getLastCommunication({
      userId: user?.id,
      businessId,
    });

    if (lastCommunication) {
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (lastCommunication.createdAt.getTime() < oneHourAgo) {
        await increasePriorityIndex(businessId);
      }
    } else {
      await increasePriorityIndex(businessId);
    }

    await createCommunication({
      message,
      businessId,
      userId: user?.id ?? undefined,
      type,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Communication created",
    });
  } catch (error) {
    next(error);
  }
}

export async function getCommunicationsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (user?.type !== "ADMIN" && !user?.business?.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "User is not authorized to view communications",
      });
    }

    const { limit, page } = getCommunicationsValidation(request);

    const totalCommunications = await countCommunications(
      user?.business?.id ?? undefined
    );

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalCommunications,
    });

    const skip = (page - 1) * limit;
    const communications = await getCommunications({
      limit,
      skip,
      businessId: user?.business?.id ?? undefined,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Communications fetched",
      data: communications,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCommunicationController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { communicationId } = updateCommunicationValidation(request);

    const communication = await getCommunicationById(communicationId);

    if (!communication) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Communication not found",
      });
    }

    if (!communication.user || !communication.userId) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "communication is guest user",
      });
    }

    await sendReviewEmail({
      businessName: communication.business.name,
      userName: communication.user?.firstName,
      email: communication.user.email,
      id: communication.id,
    });

    await updateCommunication({
      businessId: communication.businessId,
      userId: communication.userId,
      status: "PENDING",
      newStatus: "SENDED",
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Communication updated",
    });
  } catch (error) {
    next(error);
  }
}

export async function getSingleCommunicationController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { communicationId } = getSingleCommunicationValidation(request);

    const communication = await getCommunicationById(communicationId);

    if (!communication) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Communication not found",
      });
    }

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Communication fetched",
      data: communication,
    });
  } catch (error) {
    next(error);
  }
}
