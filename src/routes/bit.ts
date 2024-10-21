import express from "express";
import authenticate from "../middlewares/authenticate";
import { createBitController, getBitsController } from "../controllers/bit";

const router = express.Router();

router
  .route("/")
  .get(authenticate("PROVIDER"), getBitsController)  
  .post(authenticate("CUSTOMER"), createBitController);

export default router;
