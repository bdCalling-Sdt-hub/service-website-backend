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
