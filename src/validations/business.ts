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

  if (body.cancelUrl && typeof body.cancelUrl !== "string")
    throw error("Cancel URL should be a string", 400);

  if (body.successUrl && typeof body.successUrl !== "string")
    throw error("Success URL should be a string", 400);

  if (body.license && typeof body.license !== "string")
    throw error("License should be a string", 400);

  if (!body.latitude || typeof body.latitude !== "number")
    throw error("Latitude should be a number", 400);

  if (!body.longitude || typeof body.longitude !== "number")
    throw error("Longitude should be a number", 400);

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
} {
  const query = request.query;

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

  return {
    limit,
    page,
    name: query.name,
    serviceId: query.serviceId,
    latitude: Number(query.latitude),
    longitude: Number(query.longitude),
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
    !body.longitude
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
