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

    const service = await createService({
      name,
      description,
      image,
    });

    return response.json(
      responseBuilder(true, 201, "Service created", service)
    );
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
    const { take, page, name } = getServicesValidation(request);

    const totalServices = await countServices({ name });

    const pagination = paginationBuilder({
      currentPage: page,
      limit: take,
      totalData: totalServices,
    });

    if (page > pagination.totalPage) {
      return response.json(responseBuilder(false, 404, "No services found"));
    }

    const skip = (page - 1) * take;
    const services = await getServices({ take, skip, name });

    return response.json(
      responseBuilder(true, 200, "Services fetched", services)
    );
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

    return response.json(
      responseBuilder(true, 200, "Service updated", service)
    );
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

    return response.json(
      responseBuilder(true, 200, "Service deleted", service)
    );
  } catch (error) {
    next(error);
  }
}
