import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  businessReportController,
  createBusinessController,
  getBusinessController,
  getBusinessesController,
  updateBusinessController,
} from "../controllers/business";

const router = express.Router();

router
  .route("/")
  .get(getBusinessesController)
  .post(authenticate("PROVIDER"), createBusinessController);

router.post("/report",authenticate("ADMIN"), businessReportController);

router
  .route("/:id")
  .put(authenticate("PROVIDER"), updateBusinessController)
  .get(getBusinessController);

export default router;
