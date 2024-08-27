import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/jwt";
import responseBuilder from "../utils/responseBuilder";
import { getUserById } from "../services/user";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

type UserTypes = "ADMIN" | "CUSTOMER" | "PROVIDER";

export default function authenticate(...allowedRoles: (UserTypes)[]) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const bearerToken = request.headers.authorization;

      if (!bearerToken)
        return responseBuilder(response, {
          ok: false,
          statusCode: 400,
          message: "Authorization token is required",
        });

      if (!bearerToken.startsWith("Bearer "))
        return responseBuilder(response, {
          ok: false,
          statusCode: 400,
          message: "Invalid token format",
        });

      const token = bearerToken.split(" ")[1];

      const tokenData = verifyToken(token);

      if (!tokenData)
        return responseBuilder(response, {
          ok: false,
          statusCode: 400,
          message: "Invalid token",
        });

      const user = await getUserById(tokenData.id);

      if (!user) {
        return responseBuilder(response, {
          ok: false,
          statusCode: 404,
          message: "User not found",
        });
      }

      if (allowedRoles.length && !allowedRoles.includes(user.type)) {
        return responseBuilder(response, {
          ok: false,
          statusCode: 403,
          message: "Only " + allowedRoles.join(", ") + " can access this route",
        });
      }

      request.user = user;

      next();
    } catch (error) {
      next(error);
    }
  };
}
