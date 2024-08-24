import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createBusinessController,
  getBusinessController,
  getBusinessesController,
  updateBusinessController,
} from "../controllers/business";
import { getBusinessById } from "../services/business";

const router = express.Router();

router
  .route("/")
  .get(getBusinessesController)
  .post(authenticate("PROVIDER"), createBusinessController);

router
  .route("/:id")
  .put(authenticate("PROVIDER"), updateBusinessController)
  .get(getBusinessController);

export default router;
