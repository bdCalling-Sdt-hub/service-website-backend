import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createJobApplicationValidation(request: Request): {
  jobId: string;
  resume: string;
} {
  const body = request.body;

  if (!body.jobId) throw error("Job id is required", 400);

  if (!body.resume) throw error("Resume is required", 400);

  if (typeof body.jobId !== "string")
    throw error("Job id should be a string", 400);

  if (!isValidObjectId(body.jobId)) throw error("Job id is not valid", 400);

  if (typeof body.resume !== "string")
    throw error("Resume should be a string", 400);

  return {
    jobId: body.jobId,
    resume: body.resume,
  };
}

export function getJobApplicationsValidation(request: Request): {
  limit: number;
  page: number;
  jobId: string;
} {
  const query = request.query;

  if (!query.limit) throw error("Limit is required", 400);

  if (!query.page) throw error("Page is required", 400);

  if (typeof query.limit !== "string")
    throw error("Limit should be a number", 400);

  if (typeof query.page !== "string")
    throw error("Page should be a number", 400);

  if (!query.jobId) throw error("Job id is required", 400);

  if (typeof query.jobId !== "string")
    throw error("Job id should be a string", 400);

  if (!isValidObjectId(query.jobId)) throw error("Job id is not valid", 400);

  return {
    limit: parseInt(query.limit),
    page: parseInt(query.page),
    jobId: query.jobId,
  };
}
