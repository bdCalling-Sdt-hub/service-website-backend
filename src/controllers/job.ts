import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import { countJobs, createJob, deleteJob, getJobById, getJobs } from "../services/job";
import { createJobValidation, getJobsValidation } from "../validations/job";

export async function createJobController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    if (!user.business) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You need to have a business to create a job",
      });
    }

    const { description, email, phone, title } = createJobValidation(request);

    const job = await createJob({
      businessId: user.business.id,
      description,
      email,
      phone,
      title,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Job created",
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

export async function getJobsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page, title, businessId, latitude, longitude, createdAt } =
      getJobsValidation(request);

    const totalJobs = await countJobs({
      businessId,
      latitude,
      longitude,
      title,
    });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalJobs,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const jobs = await getJobs({
      createdAt,
      limit,
      skip,
      businessId,
      latitude,
      longitude,
      title,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Jobs found",
      data: jobs,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteJobController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { jobId } = request.params;

    const job = await getJobById(jobId);

    if (!job) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Job not found",
      });
    }

    if (job.businessId !== user?.business?.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You are not authorized to delete this job",
      });
    }

    await deleteJob(jobId);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Job deleted",
    });
  } catch (error) {
    next(error);
  }
}
