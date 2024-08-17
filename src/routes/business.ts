import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createBusinessController,
  getBusinessesController,
  updateBusinessController,
} from "../controllers/business";

const router = express.Router();

router
  .route("/")
  .get(getBusinessesController)
  .post(authenticate("PROVIDER"), createBusinessController);

router.put("/:id", authenticate("PROVIDER"), updateBusinessController);

export default router;
