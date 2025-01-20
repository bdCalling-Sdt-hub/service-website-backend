import type { Request, Response, NextFunction } from "express";
import { getAppData, createAppData, updateAppData } from "../services/appData";
import responseBuilder from "../utils/responseBuilder";
import { getHTMLValidation, updateAppDataValidation } from "../validations/appData";

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

export async function getHTMLController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const appData = await getAppData();

    const { page } = getHTMLValidation(request);

    if (!appData) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "App data not found",
      });
    }

    response.header("Content-Type", "text/html");
    response.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1{
            color: #444;
        }
        footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${
          page === "about.html"
            ? "About Us"
            : page === "privacy.html"
            ? "Privacy Policy"
            : "Trams of Services"
        }</h1>
        ${
          page === "about.html"
            ? appData.about
            : page === "privacy.html"
            ? appData.privacy
            : appData.terms
        }
    </div>
</body>
</html>
`);
  } catch (error) {
    next(error);
  }
}