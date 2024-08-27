import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import { countMessages, createMessage, getMessages } from "../services/message";
import {
  createMessageValidation,
  getMessagesValidation,
} from "../validations/message";

export async function getMessagesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { page, limit } = getMessagesValidation(request);

    const totalMessages = await countMessages(
      user.type === "ADMIN" ? undefined : user.businessId
    );

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalMessages,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const messages = await getMessages({
      businessId: user.type === "ADMIN" ? undefined : user.businessId,
      limit,
      skip,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Messages",
      data: messages,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function createMessageController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { message, businessId } = createMessageValidation(request);

    const newMessage = await createMessage({
      userId: user.id,
      businessId,
      message,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Message created",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
}
