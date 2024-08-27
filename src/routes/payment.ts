import express from "express";
import {
  createPaymentController,
  createCheckoutSessionController,
  getPaymentChartController,
  getPaymentsController,
  getTotalEarningsController,
  webhookController,
} from "../controllers/payment";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router
  .route("/")
  .post(authenticate("PROVIDER"), createPaymentController)
  .get(authenticate("ADMIN"), getPaymentsController);

router.post(
  "/create-checkout-session",
  authenticate("PROVIDER"),
  createCheckoutSessionController
);
router.post("/webhook", webhookController);
router.get("/total", authenticate("ADMIN"), getTotalEarningsController);
router.get("/chart", authenticate("ADMIN"), getPaymentChartController);

export default router;
