import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import { createCommunicationValidation } from "../validations/communication";
import { createCommunication } from "../services/communication";

export async function createCommunicationController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request?.user ?? undefined;

    const { message, businessId, type } =
      createCommunicationValidation(request);

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
