import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function getMessagesValidation(request: Request): {
  limit: number;
  page: number;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  return {
    limit,
    page,
  };
}

export function createMessageValidation(request: Request): {
  businessId: string;
  message: string;
} {
  const body = request.body;

  if (!body.businessId) throw error("Business ID is required", 400);

  if (!body.message) throw error("Message is required", 400);

  if (typeof body.businessId !== "string")
    throw error("Business ID should be a string", 400);

  if (!isValidObjectId(body.businessId))
    throw error("Business ID is not valid", 400);

  if (typeof body.message !== "string")
    throw error("Message should be a string", 400);

  if (body.message.trim().length === 0)
    throw error("Message should not be empty", 400);

  return {
    businessId: body.businessId,
    message: body.message,
  };
}
