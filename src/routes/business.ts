import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  businessReportController,
  createBusinessController,
  getBestsProviders,
  getBusinessController,
  getBusinessesController,
  getTotalStar,
  sendReportController,
  updateBusinessController,
} from "../controllers/business";

const router = express.Router();

router
  .route("/")
  .get(getBusinessesController)
  .post(authenticate("PROVIDER"), createBusinessController);

router
  .route("/report")
  .all(authenticate("ADMIN"))
  .get(businessReportController)
  .post(sendReportController);

router.get("/star", authenticate("PROVIDER"), getTotalStar);

router.get("/bests", getBestsProviders);

router
  .route("/:id")
  .put(authenticate("PROVIDER"), updateBusinessController)
  .get(getBusinessController);

export default router;
