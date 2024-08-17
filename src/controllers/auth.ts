import { Request, Response, NextFunction } from "express";
import {
  loginValidation,
  resendOtpValidation,
  registerValidation,
  verifyOtpValidation,
  forgotPasswordValidation,
} from "../validations/auth";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "../services/user";
import { createOtp, getLastOtpByUserId } from "../services/otp";
import responseBuilder from "../utils/responseBuilder";
import { hashPassword, comparePassword } from "../services/hash";
import { sentOtpByEmail } from "../services/mail";
import { generateToken } from "../services/jwt";
import { createNotification } from "../services/notification";

export async function registerController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { firstName, lastName, email, password, type, mobile } =
      registerValidation(request);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
      firstName,
      lastName,
      email,
      type,
      mobile,
      password: hashedPassword,
    });

    const otp = await createOtp(user.id);

    sentOtpByEmail(email, otp.code);

    await createNotification({
      userId: user.id,
      message: `Hello ${firstName} ${lastName}, welcome to our platform`,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 201,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email, password } = loginValidation(request);

    const user = await getUserByEmail(email);

    if (!user) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "User not found with this email",
      });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "Invalid password",
      });
    }

    if (!user.isVerified) {
      const prevuesOtp = await getLastOtpByUserId(user.id);

      if (!prevuesOtp) {
        const otp = await createOtp(user.id);
        sentOtpByEmail(user.email, otp.code);

        return responseBuilder(response, {
          ok: false,
          statusCode: 401,
          message: "Please verify your email",
          data: { id: user.id },
        });
      }

      if (prevuesOtp.createdAt > new Date(new Date().getTime() - 120000)) {
        return responseBuilder(response, {
          ok: false,
          statusCode: 400,
          message: "Please wait 120 seconds before sending another OTP",
          data: { timeLeft: 120 },
        });
      }

      const otp = await createOtp(user.id);
      sentOtpByEmail(user.email, otp.code);

      return responseBuilder(response, {
        ok: false,
        statusCode: 401,
        message: "Please verify your email",
        data: { id: user.id },
      });
    }

    const token = generateToken({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      type: user.type,
    });

    const {
      id,
      firstName,
      lastName,
      type,
      image,
      isVerified,
      mobile,
      business,
    } = user;

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "Login successful",
      data: {
        token,
        user: {
          id,
          firstName,
          lastName,
          email,
          type,
          mobile,
          image,
          isVerified,
          business,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtpController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { code, userId } = verifyOtpValidation(request);

    const user = await getUserById(userId);

    if (!user) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "User not found",
      });
    }

    const otp = await getLastOtpByUserId(userId);

    if (!otp) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "No OTP found for user",
      });
    }

    if (otp.expiredAt < new Date()) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "OTP expired",
      });
    }

    if (otp.code === code) {
      await updateUserById(userId, { isVerified: true });

      const token = generateToken({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        type: user.type,
      });

      const {
        id,
        firstName,
        lastName,
        type,
        image,
        isVerified,
        mobile,
        business,
      } = user;

      return responseBuilder(response, {
        ok: true,
        statusCode: 200,
        message: "OTP verified successfully",
        data: {
          token,
          user: {
            id,
            firstName,
            lastName,
            email: user.email,
            type,
            mobile,
            image,
            isVerified,
            business,
          },
        },
      });
    }

    return responseBuilder(response, {
      ok: false,
      statusCode: 400,
      message: "Invalid OTP",
    });
  } catch (error) {
    next(error);
  }
}

export async function resendOTPController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { userId } = resendOtpValidation(request);

    const user = await getUserById(userId);

    if (!user) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "User not found",
      });
    }

    const prevuesOtp = await getLastOtpByUserId(userId);

    if (!prevuesOtp) {
      const otp = await createOtp(userId);
      sentOtpByEmail(user.email, otp.code);

      return responseBuilder(response, {
        ok: true,
        statusCode: 200,
        message: "A OTP sent to your email",
        data: { id: user.id },
      });
    }

    if (prevuesOtp.createdAt > new Date(new Date().getTime() - 120000)) {
      const timeLeft = Math.ceil(
        (prevuesOtp.createdAt.getTime() + 120000 - new Date().getTime()) / 1000
      );

      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: `Please wait ${timeLeft} seconds before sending another OTP`,
        data: { timeLeft },
      });
    }

    const otp = await createOtp(userId);
    sentOtpByEmail(user.email, otp.code);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "A new OTP sent to your email",
      data: { id: user.id },
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email } = forgotPasswordValidation(request);
    const user = await getUserByEmail(email);
    if (!user) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: "User not found",
      });
    }

    const prevuesOtp = await getLastOtpByUserId(user.id);

    if (
      prevuesOtp &&
      prevuesOtp.createdAt > new Date(new Date().getTime() - 120000)
    ) {
      const timeLeft = Math.ceil(
        (prevuesOtp.createdAt.getTime() + 120000 - new Date().getTime()) / 1000
      );

      return responseBuilder(response, {
        ok: false,
        statusCode: 400,
        message: `Please wait ${timeLeft} seconds before sending another OTP`,
        data: { timeLeft },
      });
    }

    const otp = await createOtp(user.id);

    sentOtpByEmail(email, otp.code);

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "A OTP sent to your email",
      data: { id: user.id },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSessionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  return responseBuilder(response, {
    ok: true,
    statusCode: 200,
    message: "Session found",
    data: request.user,
  });
}
