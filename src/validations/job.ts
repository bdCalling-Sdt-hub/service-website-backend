import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createJobValidation(request: Request): {
  description: string;
  email: string;
  phone: string;
  title: string;
} {
  const body = request.body;

  if (!body.description) throw error("Description is required", 400);

  if (!body.email) throw error("Email is required", 400);

  if (!body.phone) throw error("Phone is required", 400);

  if (!body.title) throw error("Title is required", 400);

  if (typeof body.description !== "string")
    throw error("Description should be a string", 400);

  if (typeof body.email !== "string")
    throw error("Email should be a string", 400);

  if (typeof body.phone !== "string")
    throw error("Phone should be a string", 400);

  if (typeof body.title !== "string")
    throw error("Title should be a string", 400);

  if (body.description.trim().length === 0)
    throw error("Description should not be empty", 400);

  if (body.email.trim().length === 0)
    throw error("Email should not be empty", 400);

  if (body.phone.trim().length === 0)
    throw error("Phone should not be empty", 400);

  if (body.title.trim().length === 0)
    throw error("Title should not be empty", 400);

  return {
    description: body.description,
    email: body.email,
    phone: body.phone,
    title: body.title,
  };
}

export function getJobsValidation(request: Request): {
  limit: number;
  page: number;
  title?: string;
  businessId?: string;
  latitude?: number;
  longitude?: number;
  createdAt: "desc" | "asc";
} {
  const query = request.query;

  let businessId: string | undefined;
  let latitude: number | undefined;
  let longitude: number | undefined;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (query.businessId && !isValidObjectId(query.businessId as string)) {
    throw error("Invalid business id", 400);
  } else {
    businessId = query.businessId as string;
  }

  if (query.latitude && isNaN(parseFloat(query.latitude as string))) {
    throw error("Invalid latitude", 400);
  } else {
    latitude = parseFloat(query.latitude as string) || undefined;
  }

  if (query.longitude && isNaN(parseFloat(query.longitude as string))) {
    throw error("Invalid longitude", 400);
  } else {
    longitude = parseFloat(query.longitude as string) || undefined;
  }

  if (
    query.createdAt &&
    query.createdAt !== "desc" &&
    query.createdAt !== "asc"
  ) {
    throw error("Invalid createdAt", 400);
  }

  return {
    limit,
    page,
    businessId,
    latitude,
    longitude,
    title: (query.title as string) || undefined,
    createdAt: (query.createdAt as "desc" | "asc") || "desc",
  };
}


export function deleteJobValidation(request: Request): {
  jobId: string;
} {
  const params = request.params;

  if (!params.jobId) throw error("Job id is required", 400);

  if (!isValidObjectId(params.jobId))
    throw error("Invalid job id", 400);

  return {
    jobId: params.jobId,
  };
}