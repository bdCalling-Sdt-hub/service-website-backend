import express from "express";
import {
  loginController,
  registerController,
  resendOTPController,
  verifyOtpController,
  forgotController,
  getSessionController,
} from "../controllers/auth";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.post("/login", loginController);

router.post("/register", registerController);

router.post("/forgot", forgotController);

router.get(
  "/session",
  authenticate(),
  getSessionController
);

router.route("/otp").post(verifyOtpController).get(resendOTPController);

export default router;
