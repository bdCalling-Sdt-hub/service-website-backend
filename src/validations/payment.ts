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
  startDate?: Date;
  endDate?: Date;
} {
  const query = request.query;

  let startDate = undefined;
  let endDate = undefined;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (query.startDate && typeof query.startDate === "string") {
    startDate = new Date(query.startDate);
  }

  if (query.endDate && typeof query.endDate === "string") {
    endDate = new Date(query.endDate);
  }

  return {
    page,
    limit,
    startDate,
    endDate,
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

export function paymentReportValidation(request: Request) {
  const query = request.query;

  let startDate = undefined;
  let endDate = undefined;

  if(!query.startDate && !query.endDate) {
    throw error("Start date or end date is required", 400);
  }

  if (!query.businessId) {
    throw error("Business ID is required", 400);
  }

  if (typeof query.startDate === "string") {
    startDate = new Date(query.startDate);
  }

  if (!startDate?.getTime()) {
    throw error("Start date is required", 400);
  }

  if (typeof query.endDate === "string") {
    endDate = new Date(query.endDate);
  }

  if (!endDate?.getTime()) {
    throw error("End date is required", 400);
  }

  if (typeof query.businessId !== "string") {
    throw error("Business ID should be a string", 400);
  }

  if (!isValidObjectId(query.businessId)) {
    throw error("Business ID is not valid", 400);
  }

  return {
    startDate,
    endDate,
    businessId: query.businessId,
  };
}


export function upgradePlanValidation(request: Request): {
  subscriptionId: string;
} {
  const body = request.body;

  if (!body.subscriptionId) {
    throw error("subscription Id is required", 400);
  }

  if (!isValidObjectId(body.subscriptionId)) {
    throw error("subscription Id should be a valid ObjectId", 400);
  }

  return {
    subscriptionId: body.subscriptionId,
  };
}