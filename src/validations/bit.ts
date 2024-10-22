import type { Request } from "express";
import error from "../utils/error";

export function createBitValidation(request: Request): {
  communicationPreference: "email" | "call";
  description: string;
  image?: string;
  latitude: number;
  longitude: number;
  serviceId: string;
} {
  const body = request.body;

  if (!body.communicationPreference) {
    throw error("communicationPreference is required", 400);
  }

  if (typeof body.communicationPreference !== "string") {
    throw error("communicationPreference should be a string", 400);
  }

  if (
    body.communicationPreference !== "email" &&
    body.communicationPreference !== "call"
  ) {
    throw error("communicationPreference should be either email or call", 400);
  }

  if (!body.description) {
    throw error("description is required", 400);
  }

  if (typeof body.description !== "string") {
    throw error("description should be a string", 400);
  }

  if (body.image && typeof body.image !== "string") {
    throw error("image should be a string", 400);
  }

  if (!body.latitude) {
    throw error("latitude is required", 400);
  }

  if (isNaN(Number(body.latitude))) {
    throw error("latitude should be a number", 400);
  }

  if (!body.longitude) {
    throw error("longitude is required", 400);
  }

  if (isNaN(Number(body.longitude))) {
    throw error("longitude should be a number", 400);
  }

  if (!body.serviceId) {
    throw error("serviceId is required", 400);
  }

  if (typeof body.serviceId !== "string") {
    throw error("serviceId should be a string", 400);
  }

  return {
    communicationPreference: body.communicationPreference,
    description: body.description,
    image: body.image,
    latitude: Number(body.latitude),
    longitude: Number(body.longitude),
    serviceId: body.serviceId,
  };
}

export function getBitsValidation(request: Request): {
  limit: number;
  page: number;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  return {
    limit,
    page,
  };
}
