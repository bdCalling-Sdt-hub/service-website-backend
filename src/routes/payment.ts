import express from "express";
import { createPaymentController } from "../controllers/payment";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.route("/").post(authenticate("PROVIDER"), createPaymentController);

export default router;
