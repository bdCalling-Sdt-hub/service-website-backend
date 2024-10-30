import { Request, Response, NextFunction } from "express";
import paginationBuilder from "../utils/paginationBuilder";
import responseBuilder from "../utils/responseBuilder";
import {
  countJobApplications,
  createJobApplication,
  getJobApplicationByUserIdAndJobId,
  getJobApplications,
} from "../services/jobApplication";
import {
  createJobApplicationValidation,
  getJobApplicationsValidation,
} from "../validations/jobApplication";
import { getJobById } from "../services/job";
import { sendJobApplicationNotification } from "../services/mail";

const backendUrl = process.env.BACKEND_URL;
if (!backendUrl) {
  throw new Error("BACKEND_URL is not defined.");
}

export async function createJobApplicationController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { jobId, resume } = createJobApplicationValidation(request);

    const job = await getJobById(jobId);

    if (!job) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Job not found",
      });
    }

    const isJobApplicationExist = await getJobApplicationByUserIdAndJobId({
      userId: user.id,
      jobId,
    });

    if (isJobApplicationExist) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "You have already applied for this job.",
      });
    }

    const jobApplication = await createJobApplication({
      userId: user.id,
      jobId,
      resume,
    });

    sendJobApplicationNotification(
      job.email,
      user.firstName + " " + user.lastName,
      job.title,
      backendUrl + "/" + jobApplication.resume
    );

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Job application submitted.",
      data: jobApplication,
    });
  } catch (error) {
    next(error);
  }
}

export async function getJobApplicationsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page, jobId } = getJobApplicationsValidation(request);

    const job = await getJobById(jobId);

    if (!job) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Job not found",
      });
    }

    if (job.businessId !== request.user.business.id) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 403,
        message: "You are not authorized to view this job applications",
      });
    }

    const totalJobApplications = await countJobApplications({ jobId });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalJobApplications,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;

    const jobApplications = await getJobApplications({
      limit,
      skip,
      jobId,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Job applications found",
      data: jobApplications,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}
