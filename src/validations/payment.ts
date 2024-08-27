import type { Request } from "express";
import { isValidObjectId } from "../utils/validators";
import error from "../utils/error";

export function createPaymentValidation(request: Request): {
  bsb_number: string;
  account_number: string;
  priceId: string;
} {
  const body = request.body;

  // bsb_number: '000000', // Example BSB number
  //   account_number: '000123456', // Example account number
  // priceId

  if (!body.bsb_number) {
    throw error("bsb_number is required", 400);
  }

  if (typeof body.bsb_number !== "string") {
    throw error("bsb_number should be a string", 400);
  }

  if (!body.account_number) {
    throw error("account_number is required", 400);
  }

  if (typeof body.account_number !== "string") {
    throw error("account_number should be a string", 400);
  }

  if (!body.priceId) {
    throw error("priceId is required", 400);
  }

  if (typeof body.priceId !== "string") {
    throw error("priceId should be a string", 400);
  }

  return {
    bsb_number: body.bsb_number,
    account_number: body.account_number,
    priceId: body.priceId,
  };
}

export function getPaymentChartValidation(request: Request): { year: string } {
  const query = request.query;

  if (query.year && typeof query.year !== "string") {
    throw error("Year should be a string", 400);
  }

  if (query.year && isNaN(parseInt(query.year))) {
    throw error("Year should be a number", 400);
  }

  return {
    year: query.year || new Date().getFullYear().toString(),
  };
}

export function getPaymentsValidation(request: Request): {
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

export function createCheckoutSessionValidation(request: Request): {
  subscriptionId: string;
  cancelUrl: string;
  successUrl: string;
} {
  const body = request.body;

  if (!body.subscriptionId) {
    throw error("subscription Id is required", 400);
  }

  if (!isValidObjectId(body.subscriptionId)) {
    throw error("subscription Id should be a valid ObjectId", 400);
  }

  if (!body.cancelUrl) {
    throw error("cancelUrl is required", 400);
  }

  if (typeof body.cancelUrl !== "string") {
    throw error("cancelUrl should be a string", 400);
  }

  if (!body.successUrl) {
    throw error("successUrl is required", 400);
  }

  if (typeof body.successUrl !== "string") {
    throw error("successUrl should be a string", 400);
  }

  return {
    subscriptionId: body.subscriptionId,
    cancelUrl: body.cancelUrl,
    successUrl: body.successUrl,
  };
}
