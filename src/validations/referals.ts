import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createReferralValidation(request: Request): {
  name: string;
  email: string;
  phone: string;
  businessId: string;
} {
  const body = request.body;

  if (!body.name) throw error("Name is required", 400);

  if (!body.email) throw error("Email is required", 400);

  if (!body.phone) throw error("Phone is required", 400);

  if (!body.businessId) throw error("Business ID is required", 400);

  if (typeof body.name !== "string")
    throw error("Name should be a string", 400);

  if (typeof body.email !== "string")
    throw error("Email should be a string", 400);

  if (typeof body.phone !== "string")
    throw error("Phone should be a string", 400);

  if (typeof body.businessId !== "string")
    throw error("Business ID should be a string", 400);

  if (body.name.trim().length === 0)
    throw error("Name should not be empty", 400);

  if (body.email.trim().length === 0)
    throw error("Email should not be empty", 400);

  if (body.phone.trim().length === 0)
    throw error("Phone should not be empty", 400);

  if (body.businessId.trim().length === 0)
    throw error("Business ID should not be empty", 400);

  if (!isValidObjectId(body.businessId))
    throw error("Business ID is invalid", 400);

  return {
    name: body.name,
    email: body.email,
    phone: body.phone,
    businessId: body.businessId,
  };
}

export function getReferralsValidation(request: Request): {
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
    limit,
    page,
  };
}
