import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function getAddressesValidation(request: Request): {
  limit: number;
  page: number;
  suburb?: string;
  state?: string;
  postalCode?: string;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (query.suburb && typeof query.suburb !== "string") {
    throw error("Suburb must be a string", 400);
  }

  if (query.state && typeof query.state !== "string") {
    throw error("State must be a string", 400);
  }

  if (query.postalCode && typeof query.postalCode !== "string") {
    throw error("Postal code must be a string", 400);
  }

  if (query.postalCode && isNaN(parseInt(query.postalCode as string))) {
    throw error("Postal code must be a number", 400);
  }

  return {
    limit,
    page,
    suburb: query.suburb,
    state: query.state,
    postalCode: query.postalCode,
  };
}

export function getAddressByIdValidation(request: Request): {
  addressId: string;
} {
  const params = request.params;

  const addressId = params.addressId;

  if (!addressId) {
    throw error("Address id is required", 400);
  }

  if (!isValidObjectId(addressId)) {
    throw error("Invalid address id", 400);
  }

  return {
    addressId,
  };
}
