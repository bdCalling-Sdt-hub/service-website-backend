import { Request } from "express";
import error from "../utils/error";
import { isValidObjectId, validatePassword } from "../utils/validators";

export function getUserValidation(request: Request): {
  userId: string;
} {
  const userId = request.params.userId;

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!isValidObjectId(userId)) throw error("Invalid user ID", 400);

  return {
    userId,
  };
}

export function updateUserValidation(request: Request): {
  userId: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  image?: string;
  password?: string;
} {
  const userId = request.params.userId;
  const body = JSON.parse(JSON.stringify(request.body));

  if (!userId) {
    throw error("User ID is required", 400);
  }

  if (!isValidObjectId(userId)) throw error("Invalid user ID", 400);

  if (body.firstName && typeof body.firstName !== "string")
    throw error("First name should be a string", 400);

  if (body.lastName && typeof body.lastName !== "string")
    throw error("Last name should be a string", 400);

  if (body.mobile && typeof body.mobile !== "string")
    throw error("Mobile should be a string", 400);

  if (body.image && typeof body.image !== "string")
    throw error("Image should be a string", 400);

  if (body.password && typeof body.password !== "string")
    throw error("Password should be a string", 400);

  if (body.password) validatePassword(body.password);

  if (
    !body.firstName &&
    !body.lastName &&
    !body.mobile &&
    !body.image &&
    !body.password
  ) {
    throw error("No valid data to update", 400);
  }

  return {
    userId,
    firstName: body.firstName,
    lastName: body.lastName,
    mobile: body.mobile,
    image: body.image,
    password: body.password,
  };
}

export function changePasswordValidation(request: Request): {
  oldPassword?: string;
  newPassword: string;
  userId: string;
} {
  const body = request.body;
  const userId = request.params.userId;

  if (!userId) {
    throw error("User ID is required", 400);
  }

  if (!isValidObjectId(userId)) throw error("Invalid user ID", 400);

  if (!body.newPassword) throw error("New password is required", 400);

  validatePassword(body.newPassword);

  if (body.oldPassword) validatePassword(body.oldPassword);

  return {
    oldPassword: body.oldPassword,
    newPassword: body.newPassword,
    userId,
  };
}

export function getUsersValidation(request: Request): {
  limit: number;
  page: number;
  type?: "CUSTOMER" | "PROVIDER";
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (query.type && typeof query.type !== "string")
    throw error("Type should be a string", 400);

  if (query.type && query.type !== "CUSTOMER" && query.type !== "PROVIDER")
    throw error("Invalid type", 400);

  return {
    limit,
    page,
    type: query.type as "CUSTOMER" | "PROVIDER",
  };
}
