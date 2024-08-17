import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createBusinessValidation(request: Request): {
  abn: string;
  about: string;
  license: string | undefined;
  mainServiceId: string;
  mobile: string;
  name: string;
  openHour: string;
  website: string;
  address: string;
  city: string;
  facebook: string | undefined;
  instagram: string | undefined;
  phone: string | undefined;
  postalCode: string;
  state: string;
  services: string[];
} {
  const body = request.body;

  if (!body.abn) throw error("ABN is required", 400);

  if (!body.about) throw error("About is required", 400);

  if (!body.mainServiceId) throw error("Main Service is required", 400);

  if (!body.mobile) throw error("Mobile is required", 400);

  if (!body.name) throw error("Name is required", 400);

  if (!body.address) throw error("Address is required", 400);

  if (!body.city) throw error("City is required", 400);

  if (!body.postalCode) throw error("Postal Code is required", 400);

  if (!body.state) throw error("State is required", 400);

  if (!body.services) throw error("Services is required", 400);

  if (!Array.isArray(body.services))
    throw error("Services should be an array", 400);

  if (body.services.length === 0)
    throw error("Services should not be empty", 400);

  if (body.services.some((service: any) => typeof service !== "string"))
    throw error("Services should be an array of strings", 400);

  if (body.website && typeof body.website !== "string")
    throw error("Website should be a string", 400);

  if (body.website && body.website.trim().length === 0)
    throw error("Website should not be empty", 400);

  if (body.phone && typeof body.phone !== "string")
    throw error("Phone should be a string", 400);

  if (body.facebook && typeof body.facebook !== "string")
    throw error("Facebook should be a string", 400);

  if (body.instagram && typeof body.instagram !== "string")
    throw error("Instagram should be a string", 400);

  if (body.license && typeof body.license !== "string")
    throw error("License should be a string", 400);

  if (!body.openHour) throw error("Open Hour is required", 400);

  if (typeof body.openHour !== "string")
    throw error("Open Hour should be a string", 400);

  if (typeof body.abn !== "string") throw error("ABN should be a string", 400);

  if (typeof body.about !== "string")
    throw error("About should be a string", 400);

  if (typeof body.mainServiceId !== "string")
    throw error("Main Service should be a string", 400);

  if (typeof body.mobile !== "string")
    throw error("Mobile should be a string", 400);

  if (typeof body.name !== "string")
    throw error("Name should be a string", 400);

  if (body.name.trim().length === 0)
    throw error("Name should not be empty", 400);

  if (typeof body.address !== "string")
    throw error("Suburb should be a string", 400);

  if (!isValidObjectId(body.mainServiceId))
    throw error("Invalid Main Service ID", 400);

  return {
    abn: body.abn,
    about: body.about,
    license: body.license,
    mainServiceId: body.mainServiceId,
    mobile: body.mobile,
    name: body.name,
    openHour: body.openHour,
    website: body.website,
    address: body.address,
    city: body.city,
    facebook: body.facebook,
    instagram: body.instagram,
    phone: body.phone,
    postalCode: body.postalCode,
    state: body.state,
    services: body.services,
  };
}

export function getBusinessesValidation(request: Request): {
  limit: number;
  page: number;
  name?: string;
  address?: string;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (query.name && typeof query.name !== "string")
    throw error("Name should be a string", 400);

  if (query.address && typeof query.address !== "string")
    throw error("Suburb should be a string", 400);

  if (query.address && !isValidObjectId(query.address))
    throw error("Invalid Suburb ID", 400);

  return {
    limit,
    page,
    name: query.name,
    address: query.address,
  };
}

export function updateBusinessValidation(request: Request): {
  businessId: string;
  abn?: string;
  about?: string;
  license?: string;
  mobile?: string;
  name?: string;
  openHour?: string;
  website?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
} {
  const params = request.params;
  const body = request.body;

  if (!params.id) throw error("Business ID is required", 400);
  if (!isValidObjectId(params.id)) throw error("Invalid Business ID", 400);

  if (body.abn && typeof body.abn !== "string")
    throw error("ABN should be a string", 400);

  if (body.about && typeof body.about !== "string")
    throw error("About should be a string", 400);

  if (body.license && typeof body.license !== "string")
    throw error("License should be a string", 400);

  if (body.mobile && typeof body.mobile !== "string")
    throw error("Mobile should be a string", 400);

  if (body.name && typeof body.name !== "string")
    throw error("Name should be a string", 400);

  if (body.name && body.name.trim().length === 0)
    throw error("Name should not be empty", 400);

  if (body.openHour && typeof body.openHour !== "string")
    throw error("Open Hour should be a string", 400);

  if (body.openHour && body.openHour <= 0)
    throw error("Open Hour should be greater than 0", 400);

  if (body.website && typeof body.website !== "string")
    throw error("Website should be a string", 400);

  if (body.website && body.website.trim().length === 0)
    throw error("Website should not be empty", 400);

  if (body.phone && typeof body.phone !== "string")
    throw error("Phone should be a string", 400);

  if (body.facebook && typeof body.facebook !== "string")
    throw error("Facebook should be a string", 400);

  if (body.instagram && typeof body.instagram !== "string")
    throw error("Instagram should be a string", 400);

  if (
    !body.abn &&
    !body.about &&
    !body.license &&
    !body.mobile &&
    !body.name &&
    !body.openHour &&
    !body.website &&
    !body.phone &&
    !body.facebook &&
    !body.instagram
  )
    throw error("No valid data to update", 400);

  return {
    businessId: params.id,
    abn: body.abn,
    about: body.about,
    license: body.license,
    mobile: body.mobile,
    name: body.name,
    openHour: body.openHour,
    website: body.website,
    phone: body.phone,
    facebook: body.facebook,
    instagram: body.instagram,
  };
}
