import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import { countBits, createBit, getBits } from "../services/bit";
import { createBitValidation, getBitsValidation } from "../validations/bit";
import paginationBuilder from "../utils/paginationBuilder";

export async function createBitController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const {
      communicationPreference,
      description,
      latitude,
      longitude,
      serviceId,
      image,
    } = createBitValidation(request);

    const bit = await createBit({
      communicationPreference,
      description,
      image,
      latitude,
      longitude,
      serviceId,
      userId: user.id,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "Bit created",
      data: bit,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBitsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { limit, page } = getBitsValidation(request);

    const totalBits = await countBits({
      latitude: user.business.latitude,
      longitude: user.business.longitude,
      serviceId: user.business.mainServiceId,
    });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalBits,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const bits = await getBits({
      limit,
      skip,
      latitude: user.business.latitude,
      longitude: user.business.longitude,
      serviceId: user.business.mainServiceId,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Bits fetched",
      data: bits,
    });
  } catch (error) {
    next(error);
  }
}
