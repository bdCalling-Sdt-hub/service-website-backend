import type { Request } from "express";
import error from "../utils/error";

export function getSuburbsValidation(request: Request): {
  limit: number;
  page: number;
  postcode?: string;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (query.postcode && typeof query.postcode !== "string")
    throw error("Postcode should be a string", 400);

  if (query.postcode && isNaN(parseInt(query.postcode)))
    throw error("Postcode should be a number", 400);

  if (query.postcode && parseInt(query.postcode) < 0)
    throw error("Postcode should be a positive number", 400);

  if (query.postcode && query.postcode.length > 4)
    throw error("Postcode should be 4 digits", 400);

  return {
    limit,
    page,
    postcode: query.postcode,
  };
}
