import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import { getSuburbsValidation } from "../validations/suburb";
import { countSuburbs, getSuburbs } from "../services/suburb";

export async function getSuburbsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page, postcode } = getSuburbsValidation(request);

    const totalSuburbs = await countSuburbs(postcode);

    // const suburbs = await getSuburbs({
    //   limit,
    //   page,
    //   postcode,
    // });

    const total = await countSuburbs(postcode);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: total,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const suburbs = await getSuburbs({
      limit,
      skip,
      postcode,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Suburbs found",
      data: suburbs,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}
