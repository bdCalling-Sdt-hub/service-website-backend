import express from "express";
import authenticate from "../middlewares/authenticate";
import { createBitController, getBitsController } from "../controllers/bit";
import upload from "../middlewares/upload";

const router = express.Router();

router
  .route("/")
  .get(authenticate("PROVIDER"), getBitsController)
  .post(authenticate("CUSTOMER"), upload.single("image"), createBitController);

export default router;
