import express from "express";
import {
  createPaymentController,
  createCheckoutSessionController,
  getPaymentChartController,
  getPaymentsController,
  getTotalEarningsController,
  paymentReportController,
  upgradePlanController,
} from "../controllers/payment";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router
  .route("/")
  .post(authenticate("PROVIDER"), upgradePlanController)
  .get(authenticate("ADMIN", "PROVIDER"), getPaymentsController);

router.post(
  "/create-checkout-session",
  authenticate("PROVIDER"),
  createCheckoutSessionController
);
router.post("/webhook");
router.get("/report", authenticate("ADMIN"), paymentReportController);

router.get("/total", authenticate("ADMIN"), getTotalEarningsController);
router.get("/chart", authenticate("ADMIN"), getPaymentChartController);

export default router;
