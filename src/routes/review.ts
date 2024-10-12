import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createReviewController,
  getAllReviewsController,
  getReviewsController,
} from "../controllers/review";

const router = express.Router();

router.route("/").get(getReviewsController).post(createReviewController);

router.get("/all", authenticate("ADMIN"), getAllReviewsController);

export default router;
