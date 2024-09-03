import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";
import { verifyToken } from "../services/jwt";

export function createCommunicationValidation(request: Request): {
  message?: string;
  type: "CALL" | "MESSAGE";
  businessId: string;
  userId: string | undefined;
} {
  const body = request.body;
  const bearerToken = request.headers.authorization;
  let userId: string | undefined;

  if (bearerToken) {
    if (!bearerToken.startsWith("Bearer ")) throw error("Invalid token format", 400);

    const token = bearerToken.split(" ")[1];

    const tokenData = verifyToken(token);

    if (!tokenData) throw error("Invalid token", 400);

    userId = tokenData.id;
  }

  if (!body.businessId) throw error("Business ID is required", 400);

  if (!body.type) throw error("Type is required", 400);

  if (typeof body.type !== "string")
    throw error("Type should be a string", 400);

  if (body.type !== "CALL" && body.type !== "MESSAGE")
    throw error("Type should be either CALL or MESSAGE", 400);

  if (typeof body.businessId !== "string")
    throw error("Business ID should be a string", 400);

  if (!isValidObjectId(body.businessId))
    throw error("Business ID is not valid", 400);

  if (body.message && typeof body.message !== "string")
    throw error("Message should be a string", 400);

  if (body.type === "MESSAGE" && !body.message)
    throw error("Message is required", 400);

  return {
    message: body.message,
    type: body.type,
    businessId: body.businessId,
    userId,
  };
}

export function getCommunicationsValidation(request: Request): {
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

export function updateCommunicationValidation(request: Request): {
  communicationId: string;
} {
  const params = request.params;

  if (!params.id) throw error("Communication ID is required", 400);
  if (!isValidObjectId(params.id)) throw error("Invalid Communication ID", 400);

  return {
    communicationId: params.id,
  };
}

export function getSingleCommunicationValidation(request: Request): {
  communicationId: string;
} {
  const params = request.params;

  if (!params.id) throw error("Business ID is required", 400);
  if (!isValidObjectId(params.id)) throw error("Invalid Business ID", 400);

  return {
    communicationId: params.id,
  };
}
