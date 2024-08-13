import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createServiceValidation(request: Request): {
  name: string;
  description: string;
  image: string;
} {
  const body = request.body;

  if (!body.name) throw error("Name is required", 400);

  if (!body.description) throw error("Description is required", 400);

  if (!body.image) throw error("Image is required", 400);

  if (typeof body.name !== "string")
    throw error("Name should be a string", 400);

  if (typeof body.description !== "string")
    throw error("Description should be a string", 400);

  if (typeof body.image !== "string")
    throw error("Image should be a string", 400);

  if (body.name.trim().length === 0)
    throw error("Name should not be empty", 400);

  if (body.description.trim().length === 0)
    throw error("Description should not be empty", 400);

  if (body.image.trim().length === 0)
    throw error("Image should not be empty", 400);

  return {
    name: body.name,
    description: body.description,
    image: body.image,
  };
}

export function getServicesValidation(request: Request): {
  take: number;
  page: number;
  name?: string;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (query.name && typeof query.name !== "string")
    throw error("Name should be a string", 400);

  return {
    take: Number(query.take),
    page: Number(query.skip),
    name: query.name,
  };
}

export function updateServiceValidation(request: Request): {
  serviceId: string;
  name?: string;
  description?: string;
  image?: string;
} {
  const params = request.params;
  const body = request.body;

  if (!params.id) throw error("Service ID is required", 400);
  if (!isValidObjectId(params.id)) throw error("Invalid Service ID", 400);

  if (body.name && typeof body.name !== "string")
    throw error("Name should be a string", 400);

  if (body.description && typeof body.description !== "string")
    throw error("Description should be a string", 400);

  if (body.image && typeof body.image !== "string")
    throw error("Image should be a string", 400);

  if(!body.name && !body.description && !body.image)
    throw error("No data provided", 400);

  return {
    serviceId: params.id,
    name: body.name,
    description: body.description,
    image: body.image,
  };
}

export function deleteServiceValidation(request: Request): {
  serviceId: string;
} {
  const params = request.params;

  if (!params.id) throw error("Service ID is required", 400);
  if (!isValidObjectId(params.id)) throw error("Invalid Service ID", 400);

  return {
    serviceId: params.id,
  };
}