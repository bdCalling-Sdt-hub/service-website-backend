import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import {
  getAddressByIdValidation,
  getAddressesValidation,
} from "../validations/address";
import {
  countAddresses,
  getAddressById,
  getAddresses,
  getStates,
} from "../services/address";

export async function getAddressesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page, postalCode, state, suburb } =
      getAddressesValidation(request);

    const totalAddresses = await countAddresses({
      postalCode,
      state,
      suburb,
    });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalAddresses,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const addresses = await getAddresses({
      limit,
      skip,
      postalCode,
      state,
      suburb,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Addresses fetched",
      data: addresses,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStatesController(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const states = await getStates();
    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "States fetched",
      data: states,
    });
  } catch (error) {
    next(error);
  }
}
