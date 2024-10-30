import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createJobApplicationController,
  getJobApplicationsController,
} from "../controllers/jobApplication";
import upload from "../middlewares/upload";

const router = express.Router();

router
  .route("/")
  .get(authenticate("PROVIDER"), getJobApplicationsController)
  .post(
    authenticate("CUSTOMER"),
    upload.single("resume"),
    createJobApplicationController 
  );

export default router;
     