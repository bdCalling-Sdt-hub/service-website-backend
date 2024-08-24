import express from "express";
import {
  createPaymentController,
  getPaymentChartController,
  getPaymentsController,
  getTotalEarningsController,
} from "../controllers/payment";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router
  .route("/")
  .post(authenticate("PROVIDER"), createPaymentController)
  .get(authenticate("ADMIN"), getPaymentsController);

router.get("/total", authenticate("ADMIN"), getTotalEarningsController);
router.get("/chart", authenticate("ADMIN"), getPaymentChartController);

export default router;
