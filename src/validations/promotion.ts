import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createPromotionValidation(request: Request): {
  title: string;
  discount: number;
  startAt: Date;
  endAt: Date;
} {
  const body = request.body;

  let startAt = new Date().getTime();

  if (!body.title || !body.title.trim()) {
    throw error("Title is required", 400);
  }

  if (!body.discount) {
    throw error("Discount is required", 400);
  }

  if (typeof body.discount !== "number") {
    throw error("Discount must be a number", 400);
  }

  if (body.discount < 1 || body.discount > 100) {
    throw error("Discount must be between 0 and 100", 400);
  }

  if (body.startAt) {
    if (typeof body.startAt !== "number") {
      throw error("Start date must be a timeStamp", 400);
    }

    if (body.startAt < startAt) {
      throw error("Start date must be in the future", 400);
    }

    startAt = body.startAt;
  }

  if (!body.endAt) {
    throw error("End date is required", 400);
  }

  if (typeof body.endAt !== "number") {
    throw error("End date must be a timeStamp", 400);
  }

  if (body.endAt < new Date().getTime()) {
    throw error("End date must be in the future", 400);
  }

  if (body.endAt < startAt) {
    throw error("End date must be greater than start date", 400);
  }

  return {
    title: body.title,
    discount: body.discount,
    startAt: new Date(startAt),
    endAt: new Date(body.endAt),
  };
}

export function deletePromotionValidation(request: Request): {
  id: string;
} {
  const params = request.params;

  if (!params.id) {
    throw error("Promotion id is required", 400);
  }

  if (isValidObjectId(params.id)) {
    throw error("Invalid promotion id", 400);
  }

  return {
    id: params.id,
  };
}

export function getPromotionValidation(request: Request): {
  page: number;
  limit: number;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  return {
    page,
    limit,
  };
}
