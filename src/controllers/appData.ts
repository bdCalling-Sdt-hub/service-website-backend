import type { Request, Response, NextFunction } from "express";
import { getAppData, createAppData, updateAppData } from "../services/appData";
import responseBuilder from "../utils/responseBuilder";
import { updateAppDataValidation } from "../validations/appData";

export async function getAppDataController(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const appData = await getAppData();

    if (!appData) {
      const newAppData = await createAppData({
        about: "About us",
        privacy: "Privacy policy",
        terms: "Terms and conditions",
      });
      return responseBuilder(response, {
        ok: true,
        statusCode: 200,
        message: "App data",
        data: newAppData,
      });
    }

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "App data",
      data: appData,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAppDataController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { about, privacy, terms } = updateAppDataValidation(request);

    const appData = await getAppData();

    if (!appData) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "App data not found",
      });
    }

    const newAppData = await updateAppData({
      about,
      privacy,
      terms,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "App data updated",
      data: newAppData,
    });
  } catch (error) {
    next(error);
  }
}