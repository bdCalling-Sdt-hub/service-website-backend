import { Request, Response, NextFunction } from "express";
import { userNotificationsValidation } from "../validations/notification";
import responseBuilder from "../utils/responseBuilder";
import {
  getNotificationsByUserId,
  countNotifications,
} from "../services/notification";
import paginationBuilder from "../utils/paginationBuilder";

export async function userNotificationsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { limit, page } = await userNotificationsValidation(request);

    const totalNotifications = await countNotifications(user.id);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalNotifications,
    });

    if (page > pagination.totalPage) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "Page not found",
      });
    }

    const skip = (page - 1) * limit;
    const notifications = await getNotificationsByUserId(user.id, limit, skip);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Notifications found",
      data: notifications,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}
