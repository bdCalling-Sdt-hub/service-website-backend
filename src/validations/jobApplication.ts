import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createJobApplicationValidation(request: Request): {
  jobId: string;
  resume: string;
} {
  const body = request.body;

  if (!body.jobId) throw error("Job id is required", 400);

  if (!request.file?.filename) throw error("Resume is required", 400);

  if (typeof body.jobId !== "string")
    throw error("Job id should be a string", 400);

  if (!isValidObjectId(body.jobId)) throw error("Job id is not valid", 400);

  return {
    jobId: body.jobId,
    resume: request.file?.filename,
  };
}

export function getJobApplicationsValidation(request: Request): {
  limit: number;
  page: number;
  jobId: string;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;


  if (!query.jobId) throw error("Job id is required", 400);

  if (typeof query.jobId !== "string")
    throw error("Job id should be a string", 400);

  if (!isValidObjectId(query.jobId)) throw error("Job id is not valid", 400);

  return {
    limit,
    page,
    jobId: query.jobId,
  };
}
