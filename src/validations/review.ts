import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createReviewValidation(request: Request): {
  communicationId: string;
  rating: number;
  message: string;
  discount: number;
} {
  const body = request.body;

  if (!body.communicationId) {
    throw error("communicationId is required", 400);
  }

  if (!body.rating) {
    throw error("rating is required", 400);
  }

  if (!body.message) {
    throw error("message is required", 400);
  }

  if (!body.discount && body.discount !== 0) {
    throw error("discount is required", 400);
  }

  if (typeof body.rating !== "number") {
    throw error("rating must be a number", 400);
  }

  if (!Number.isInteger(body.rating)) {
    throw error("rating must be an integer", 400);
  }

  if (body.rating < 1 || body.rating > 5) {
    throw error("rating must be between 1 and 5", 400);
  }

  if (typeof body.message !== "string") {
    throw error("message must be a string", 400);
  }

  if (typeof body.communicationId !== "string") {
    throw error("communicationId must be a string", 400);
  }

  if (!isValidObjectId(body.communicationId)) {
    throw error("communicationId is invalid", 400);
  }

  if (typeof body.discount !== "number") {
    throw error("discount must be a number", 400);
  }

  if (
    body.discount !== 0 &&
    body.discount !== 5 &&
    body.discount !== 10 &&
    body.discount !== 15
  ) {
    throw error("discount must be 0, 5, 10 or 15", 400);
  }

  return {
    rating: body.rating,
    message: body.message,
    communicationId: body.communicationId,
    discount: body.discount,
  };
}

export function getReviewsValidation(request: Request): {
  businessId: string;
  limit: number;
  page: number;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (!query.businessId) throw error("Business ID is required", 400);

  if (typeof query.businessId !== "string")
    throw error("Business ID should be a string", 400);

  if (!isValidObjectId(query.businessId))
    throw error("Invalid business ID", 400);

  return {
    businessId: query.businessId,
    limit,
    page,
  };
}

export function getAllReviewsValidation(request: Request): {
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
