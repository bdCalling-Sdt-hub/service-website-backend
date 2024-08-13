import { Request } from "express";
import error from "../utils/error";
import {
  validateEmail,
  isValidObjectId,
  validatePassword,
} from "../utils/validators";

export function registerValidation(request: Request): {
  name: string;
  email: string;
  password: string;
  type:"CUSTOMER" | "PROVIDER";
  mobile?: string;
} {
  const data = request.body;

  if (!data.name) throw error("Name is required", 400);

  if (!data.email) throw error("Email is required", 400);

  if (!data.password) throw error("Password is required", 400);

  if (typeof data.name !== "string") throw error("Name must be a string", 400);

  if (typeof data.email !== "string")
    throw error("Email must be a string", 400);

  if (typeof data.password !== "string")
    throw error("Password must be a string", 400);

  if(data.name.length < 3) throw error("Name must be at least 3 characters", 400);

  if(data.name.length > 55) throw error("Name must be at most 55 characters", 400);

  if(data.type !== "CUSTOMER" && data.type !== "PROVIDER") throw error("Invalid type", 400);

  if(data.type==="CUSTOMER" && !data.mobile) throw error("Mobile is required", 400);

  if(data.mobile && typeof data.mobile !== "string") throw error("Mobile must be a string", 400);

  validateEmail(data.email);

  validatePassword(data.password);

  return {
    name: data.name,
    email: data.email,
    password: data.password,
    type: data.type,
    mobile: data.mobile,
  };
}

export function loginValidation(request: Request): {
  email: string;
  password: string;
} {
  const data = request.body;

  if (!data.email) throw error("Email is required", 400);

  if (!data.password) throw error("Password is required", 400);

  validateEmail(data.email);

  validatePassword(data.password);

  return {
    email: data.email,
    password: data.password,
  };
}

export function verifyOtpValidation(request: Request): {
  code: string;
  userId: string;
} {
  const data = request.body;

  if (!data.code) throw error("Code is required", 400);

  if (!data.userId) throw error("User Id is required", 400);

  if (typeof data.code !== "string") throw error("Code must be a string", 400);

  if (data.code.length !== 4) throw error("Invalid Code", 400);

  if (typeof data.userId !== "string")
    throw error("User Id must be a string", 400);

  if (!isValidObjectId(data.userId)) throw error("Invalid User Id", 400);

  return {
    code: data.code,
    userId: data.userId,
  };
}

export function resendOtpValidation(request: Request): { userId: string } {
  const data = request.query;

  if (!data.userId) throw error("User Id is required", 400);

  if (typeof data.userId !== "string")
    throw error("User Id must be a string", 400);

  if (!isValidObjectId(data.userId)) throw error("Invalid User Id", 400);

  return {
    userId: data.userId,
  };
}

export function forgotPasswordValidation(request: Request): { email: string } {
  const query = request.query as { email: string | undefined };

  if (!query.email) throw error("Email is required", 400);

  validateEmail(query.email);

  return {
    email: query.email,
  };
}
