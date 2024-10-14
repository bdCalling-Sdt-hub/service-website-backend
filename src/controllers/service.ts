import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import {
  countServices,
  createService,
  deleteService,
  getServices,
  updateService,
} from "../services/service";
import {
  createServiceValidation,
  deleteServiceValidation,
  getServicesValidation,
  updateServiceValidation,
} from "../validations/service";

export async function createServiceController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, description, image } = createServiceValidation(request);

    const existService = await getServices({ skip: 0, take: 1, name });

    if (existService.length > 0) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Service already exists with this name",
      });
    }

    const service = await createService({
      name,
      description,
      image,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Service created",
      data: service,
    });
  } catch (error) {
    next(error);
  }
}

export async function getServicesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page, name } = getServicesValidation(request);

    const totalServices = await countServices({ name });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalServices,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const services = await getServices({ take: limit, skip, name });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Services found",
      data: services,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateServiceController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, description, image, serviceId } =
      updateServiceValidation(request);

    const service = await updateService(serviceId, {
      name,
      description,
      image,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Service updated",
      data: service,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteServiceController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { serviceId } = deleteServiceValidation(request);

    const service = await deleteService(serviceId);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Service deleted",
      data: service,
    });
  } catch (error) {
    next(error);
  }
}
