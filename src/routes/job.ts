import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createJobController,
  deleteJobController,
  getJobsController,
} from "../controllers/job";

const router = express.Router();

router
  .route("/")
  .get(getJobsController)
  .post(authenticate("PROVIDER"), createJobController);

router.delete("/:id", authenticate("PROVIDER"), deleteJobController);

export default router;
