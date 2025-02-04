import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createPortfolioValidation(request: Request): {
  image: string;
} {
  const body = request.body;

  if (!body.image) throw error("Image is required", 400);

  if (typeof body.image !== "string")
    throw error("Image should be a string", 400);
  
  return {
    image: body.image,
  };
}

export function getPortfoliosValidation(request: Request): {
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


export function deletePortfolioValidation(request: Request): {
  id: string;
} {
  const params = request.params;

  if (!params.id) throw error("ID is required", 400);

  if (typeof params.id !== "string")
    throw error("ID should be a string", 400);

  if (!isValidObjectId(params.id))
    throw error("Invalid ID", 400);

  return {
    id: params.id,
  };
}