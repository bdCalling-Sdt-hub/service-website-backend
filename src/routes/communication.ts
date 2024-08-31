import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createCommunicationController,
  getCommunicationsController,
  updateCommunicationController,
  getSingleCommunicationController,
} from "../controllers/communication";

const router = express.Router();

router
  .route("/")
  .get(authenticate("ADMIN", "PROVIDER"), getCommunicationsController)
  .post(createCommunicationController);

router
  .route("/:id")
  .get(authenticate(), getSingleCommunicationController)
  .post(authenticate("ADMIN"), updateCommunicationController);

export default router;
