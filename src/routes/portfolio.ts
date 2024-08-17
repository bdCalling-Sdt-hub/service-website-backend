import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createPortfolioController,
  getPortfoliosController,
} from "../controllers/portfolio";

const router = express.Router();

router
  .route("/")
  .get(getPortfoliosController)
  .post(authenticate("PROVIDER"), createPortfolioController);

export default router;
