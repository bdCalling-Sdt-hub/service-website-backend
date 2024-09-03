import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createReviewController,
  getReviewsController,
} from "../controllers/review";

const router = express.Router();

router
  .route("/")
  .get(getReviewsController)
  .post(authenticate("CUSTOMER","PROVIDER"), createReviewController);

export default router;
