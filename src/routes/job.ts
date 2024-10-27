import express from "express";
import authenticate from "../middlewares/authenticate";
import { createJobController, getJobsController } from "../controllers/job";

const router = express.Router();

router
  .route("/")
  .get(getJobsController)
  .post(authenticate("PROVIDER"), createJobController);

export default router;
