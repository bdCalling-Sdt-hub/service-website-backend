import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createBusinessValidation(request: Request): {
  name: string;
  mainServiceId: string;
  mobile: string;
  phone?: string;
  abn: number;
  address: string;
  suburb: string;
  state: string;
  license?: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  cancelUrl: string;
  successUrl: string;
} {
  const body = request.body;

  if (!body.abn) throw error("ABN is required", 400);

  if (!body.mainServiceId) throw error("Main Service ID is required", 400);

  if (!body.mobile) throw error("Mobile is required", 400);

  if (!body.name) throw error("Name is required", 400);

  if (!body.address) throw error("Address is required", 400);

  if (!body.suburb) throw error("Suburb is required", 400);

  if (!body.postalCode) throw error("Postal Code is required", 400);

  if (!body.state) throw error("State is required", 400);

  if (typeof body.abn !== "number") throw error("ABN should be a number", 400);

  if (typeof body.mobile !== "string")
    throw error("Mobile should be a string", 400);

  if (typeof body.name !== "string")
    throw error("Name should be a string", 400);

  if (typeof body.address !== "string")
    throw error("Address should be a string", 400);

  if (typeof body.suburb !== "string")
    throw error("Suburb should be a string", 400);

  if (typeof body.postalCode !== "string")
    throw error("Postal Code should be a string", 400);

  if (typeof body.state !== "string")
    throw error("State should be a string", 400);

  if (body.name.trim().length === 0)
    throw error("Name should not be empty", 400);

  if (body.address.trim().length === 0)
    throw error("Address should not be empty", 400);

  if (body.suburb.trim().length === 0)
    throw error("Suburb should not be empty", 400);

  if (body.postalCode.trim().length === 0)
    throw error("Postal Code should not be empty", 400);

  if (body.state.trim().length === 0)
    throw error("State should not be empty", 400);

  if (!body.latitude) throw error("Latitude is required", 400);

  if (!body.longitude) throw error("Longitude is required", 400);

  if (typeof body.latitude !== "number")
    throw error("Latitude should be a number", 400);

  if (typeof body.longitude !== "number")
    throw error("Longitude should be a number", 400);

  if (body.cancelUrl && typeof body.cancelUrl !== "string")
    throw error("Cancel URL should be a string", 400);

  if (body.successUrl && typeof body.successUrl !== "string")
    throw error("Success URL should be a string", 400);

  if (body.license && typeof body.license !== "string")
    throw error("License should be a string", 400);

  return {
    abn: body.abn,
    mainServiceId: body.mainServiceId,
    mobile: body.mobile,
    name: body.name,
    address: body.address,
    suburb: body.suburb,
    postalCode: body.postalCode,
    state: body.state,
    phone: body.phone,
    cancelUrl: body.cancelUrl,
    successUrl: body.successUrl,
    license: body.license,
    latitude: body.latitude,
    longitude: body.longitude,
  };
}

export function getBusinessesValidation(request: Request): {
  limit: number;
  page: number;
  name?: string;
  serviceId?: string;
  latitude?: number;
  longitude?: number;
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

  if (query.name && typeof query.name !== "string")
    throw error("Name should be a string", 400);

  if (query.serviceId && typeof query.serviceId !== "string")
    throw error("Service ID should be a string", 400);

  if (query.serviceId && !isValidObjectId(query.serviceId))
    throw error("Invalid Service ID", 400);

  if (query.latitude && typeof Number(query.latitude) !== "number")
    throw error("Latitude should be a number", 400);

  if (query.longitude && typeof Number(query.longitude) !== "number")
    throw error("Longitude should be a number", 400);

  if (query.startDate && typeof query.startDate === "string")
    startDate = new Date(query.startDate);

  if (query.endDate && typeof query.endDate === "string")
    endDate = new Date(query.endDate);

  return {
    limit,
    page,
    name: query.name,
    serviceId: query.serviceId,
    latitude: Number(query.latitude),
    longitude: Number(query.longitude),
    endDate,
    startDate,
  };
}

export function updateBusinessValidation(request: Request): {
  businessId: string;
  abn?: number;
  name?: string;
  mobile?: string;
  phone?: string;
  about?: string;
  license?: string;
  openHour?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  address?: string;
  mainServiceId?: string;
  postalCode?: string;
  state?: string;
  suburb?: string;
  latitude?: number;
  longitude?: number;
  services?: string[];
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  bsbNumber?: string;
} {
  const params = request.params;
  const body = request.body;

  if (!params.id) throw error("Business ID is required", 400);
  if (!isValidObjectId(params.id)) throw error("Invalid Business ID", 400);

  if (body.mobile && typeof body.mobile !== "string")
    throw error("Mobile should be a string", 400);

  if (body.phone && typeof body.phone !== "string")
    throw error("Phone should be a string", 400);

  if (body.name && typeof body.name !== "string")
    throw error("Name should be a string", 400);

  if (body.about && typeof body.about !== "string")
    throw error("About should be a string", 400);

  if (body.license && typeof body.license !== "string")
    throw error("License should be a string", 400);

  if (body.openHour && typeof body.openHour !== "string")
    throw error("Open Hour should be a string", 400);

  if (body.website && typeof body.website !== "string")
    throw error("Website should be a string", 400);

  if (body.facebook && typeof body.facebook !== "string")
    throw error("Facebook should be a string", 400);

  if (body.instagram && typeof body.instagram !== "string")
    throw error("Instagram should be a string", 400);

  if (body.services && !Array.isArray(body.services))
    throw error("Services should be an array", 400);

  if (body.services && body.services.length === 0)
    throw error("Services should not be empty", 400);

  if (
    body.services &&
    body.services.some((service: unknown) => typeof service !== "string")
  )
    throw error("Services should be an array of strings", 400);

  if (body.abn && typeof body.abn !== "number")
    throw error("ABN should be a number", 400);

  if (body.address && typeof body.address !== "string")
    throw error("Address should be a string", 400);

  if (body.suburb && typeof body.suburb !== "string")
    throw error("Suburb should be a string", 400);

  if (body.postalCode && typeof body.postalCode !== "string")
    throw error("Postal Code should be a string", 400);

  if (body.state && typeof body.state !== "string")
    throw error("State should be a string", 400);

  if (body.mainServiceId && typeof body.mainServiceId !== "string")
    throw error("Main Service ID should be a string", 400);

  if (body.mainServiceId && !isValidObjectId(body.mainServiceId))
    throw error("Invalid Main Service ID", 400);

  if (body.latitude && typeof body.latitude !== "number")
    throw error("Latitude should be a number", 400);

  if (body.longitude && typeof body.longitude !== "number")
    throw error("Longitude should be a number", 400);

  if(body.accountNumber && typeof body.accountNumber !== "string")
    throw error("Account Number should be a string", 400);

  if(body.accountName && typeof body.accountName !== "string")
    throw error("Account Name should be a string", 400);

  if(body.bankName && typeof body.bankName !== "string")
    throw error("Bank Name should be a string", 400);

  if(body.bsbNumber && typeof body.bsbNumber !== "string")
    throw error("BSB Number should be a string", 400);

  if (
    !body.abn &&
    !body.name &&
    !body.mobile &&
    !body.phone &&
    !body.about &&
    !body.license &&
    !body.openHour &&
    !body.website &&
    !body.facebook &&
    !body.instagram &&
    !body.services &&
    !body.address &&
    !body.mainServiceId &&
    !body.postalCode &&
    !body.state &&
    !body.suburb &&
    !body.latitude &&
    !body.longitude &&
    !body.accountNumber &&
    !body.accountName &&
    !body.bankName &&
    !body.bsbNumber
  ) {
    throw error("No valid data to update", 400);
  }

  return {
    businessId: params.id,
    name: body.name,
    mobile: body.mobile,
    phone: body.phone,
    about: body.about,
    license: body.license,
    openHour: body.openHour,
    website: body.website,
    facebook: body.facebook,
    instagram: body.instagram,
    services: body.services,
    address: body.address,
    mainServiceId: body.mainServiceId,
    postalCode: body.postalCode,
    state: body.state,
    suburb: body.suburb,
    abn: body.abn,
    latitude: body.latitude,
    longitude: body.longitude,
    accountNumber: body.accountNumber,
    accountName: body.accountName,
    bankName: body.bankName,
    bsbNumber: body.bsbNumber,
  };
}

export function getBusinessValidation(request: Request): {
  id: string;
} {
  const params = request.params;

  if (!params.id) throw error("Business ID is required", 400);
  if (!isValidObjectId(params.id)) throw error("Invalid Business ID", 400);

  return {
    id: params.id,
  };
}

export function businessReportValidation(request: Request): {
  startDate: Date;
  endDate: Date;
  businessName?: string;
  serviceId?: string;
  suburb?: string;
  active?: boolean;
  workStatus?: boolean;
  subscriptionId?: string;
} {
  const query = request.query;

  if (!query.startDate) throw error("Start Date is required", 400);
  if (!query.endDate) throw error("End Date is required", 400);

  if (typeof query.startDate !== "string")
    throw error("Start Date should be a string", 400);

  if (typeof query.endDate !== "string")
    throw error("End Date should be a string", 400);

  if (!new Date(query.startDate).getTime())
    throw error("Invalid Start Date", 400);

  if (!new Date(query.endDate).getTime()) throw error("Invalid End Date", 400);

  if (query.businessName && typeof query.businessName !== "string")
    throw error("Business Name should be a string", 400);

  if (query.serviceId && typeof query.serviceId !== "string")
    throw error("Service ID should be a string", 400);

  if (query.suburb && typeof query.suburb !== "string")
    throw error("Suburb should be a string", 400);

  if (query.active && typeof query.active !== "boolean")
    throw error("Active should be a boolean", 400);

  if (query.workStatus && typeof query.workStatus !== "boolean")
    throw error("Work Status should be a boolean", 400);

  if (query.subscriptionId && typeof query.subscriptionId !== "string")
    throw error("Subscription ID should be a string", 400);

  if (query.subscriptionId && !isValidObjectId(query.subscriptionId))
    throw error("Invalid Subscription ID", 400);

  if (query.serviceId && !isValidObjectId(query.serviceId))
    throw error("Invalid Service ID", 400);

  return {
    startDate: new Date(query.startDate),
    endDate: new Date(query.endDate),
    businessName: query.businessName || undefined,
    serviceId: query.serviceId || undefined,
    suburb: query.suburb || undefined,
    active: query.active === "true" || undefined,
    workStatus: query.workStatus === "true" || undefined,
    subscriptionId: query.subscriptionId || undefined,
  };
}

export function sendReportValidation(request: Request): {
  startDate: Date;
  endDate: Date;
} {
  const body = request.body;

  if (!body.startDate || !body.endDate) {
    throw error("Start Date and End Date is required", 400);
  }
  if (typeof body.startDate !== "string")
    throw error("Start Date should be a string", 400);

  if (typeof body.endDate !== "string")
    throw error("End Date should be a string", 400);

  if (!new Date(body.startDate).getTime())
    throw error("Invalid Start Date", 400);

  if (!new Date(body.endDate).getTime()) throw error("Invalid End Date", 400);

  return {
    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate),
  };
}
