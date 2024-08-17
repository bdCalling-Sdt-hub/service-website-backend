import { NextFunction, Request, Response } from "express";
import { getUserById, updateUserById } from "../services/user";
import {
  getUserValidation,
  updateUserValidation,
  changePasswordValidation,
} from "../validations/user";
import responseBuilder from "../utils/responseBuilder";
import { comparePassword, hashPassword } from "../services/hash";

// export async function getUserController(
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) {
//   try {
//     const { userId } = getUserValidation(request);

//     // if (tokenData.id !== userId) {
//     //   return response.json({
//     //     success: false,
//     //     status: 401,
//     //     message: "Unauthorized",
//     //   });
//     // }

//     const user = await getUserById(userId);

//     if (!user) {
//       return response.json(responseBuilder(false, 400, "User not found"));
//     }

//     return response.json(responseBuilder(true, 200, "User retrieved", user));
//   } catch (error) {
//     next(error);
//   }
// }

export async function updateUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { userData, userId } = updateUserValidation(request);

    if (request.user.id !== userId) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    if (Object.keys(userData).length === 0) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Provide data not allowed to update",
      });
    }

    const user = await updateUserById(userId, userData);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "User updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function changePasswordController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { oldPassword, newPassword, userId } =
      changePasswordValidation(request);

    if (user.id !== userId) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    if (oldPassword) {
      const user = await getUserById(userId, true);

      if (!user) {
        return responseBuilder(response, {
          ok: false,
          statusCode: 400,
          message: "User not found",
        });
      }

      const isMatch = await comparePassword(oldPassword, user.password);

      if (!isMatch) {
        return responseBuilder(response, {
          ok: false,
          statusCode: 400,
          message: "Invalid password",
        });
      }
    }

    const hashedPassword = await hashPassword(newPassword);

    await updateUserById(userId, { password: hashedPassword });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Password updated",
    });
  } catch (error) {
    next(error);
  }
}
