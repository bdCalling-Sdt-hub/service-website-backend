import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createPortfolioController,
  deletePortfolioController,
  getPortfoliosController,
} from "../controllers/portfolio";
import upload from "../middlewares/upload";

const router = express.Router();

router
  .route("/")
  .get(getPortfoliosController)
  .post(
    authenticate("PROVIDER"),
    upload.single("image"),
    createPortfolioController
  );

router.delete("/:id", authenticate("PROVIDER"), deletePortfolioController);

export default router;
