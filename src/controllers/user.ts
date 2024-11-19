import { NextFunction, Request, Response } from "express";
import {
  countUsers,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../services/user";
import {
  getUserValidation,
  updateUserValidation,
  changePasswordValidation,
  getUsersValidation,
  deleteUserValidation,
  unsubscribeValidation,
} from "../validations/user";
import responseBuilder from "../utils/responseBuilder";
import { comparePassword, hashPassword } from "../services/hash";
import paginationBuilder from "../utils/paginationBuilder";
import {
  cancelSubscription,
  getCustomers,
  getSubscriptionByCustomerId,
} from "../services/stripe";
import { updateBusiness } from "../services/business";

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
    const { userId, firstName, image, lastName, mobile, password } =
      updateUserValidation(request);

    if (request.user.id !== userId) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const user = await updateUserById(userId, {
      firstName,
      image,
      lastName,
      mobile,
      password,
    });

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

export async function getUsersController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page, type, endDate, name, startDate } =
      getUsersValidation(request);

    const totalUsers = await countUsers({ type, startDate, endDate, name });

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalUsers,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }
    const skip = (page - 1) * limit;

    const users = await getUsers({
      limit,
      skip,
      type,
      startDate,
      endDate,
      name,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Users retrieved",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTotalCustomerAndProviderController(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const totalCustomer = await countUsers({ type: "CUSTOMER" });
    const totalProvider = await countUsers({ type: "PROVIDER" });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Total customer and provider retrieved",
      data: { totalCustomer, totalProvider },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { userId } = deleteUserValidation(request);
    const user = await getUserById(userId);

    if (!user) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    const stripeCustomer = await getCustomers(user.email);

    if (stripeCustomer) {
      const stripeSubscription = await getSubscriptionByCustomerId(
        stripeCustomer?.data[0]?.id
      );
      if (stripeSubscription) {
        await cancelSubscription(stripeSubscription?.data[0]?.id);
      }
    }

    if (user.business) {
      await updateBusiness(user.business.id, { subscriptionEndAt: new Date() });
    }

    await deleteUserById(user.id);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
}

export async function unsubscribeController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { userId } = unsubscribeValidation(request);

    const user = await getUserById(userId);

    if (!user) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    if (user.business) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "service provider can't unsubscribe",
      });
    }

    await updateUserById(userId, { unsubscribe: true });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Unsubscribed",
    });
  } catch (error) {
    next(error);
  }
}
