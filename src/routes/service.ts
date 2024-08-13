import express from "express";
// import { allRegisteredUser, onlyArtist } from "../middlewares/isAllowedUser";
import {
  createServiceController,
  getServicesController,
  deleteServiceController,
  updateServiceController,
} from "../controllers/service";

const router = express.Router();

router.route("/").get(getServicesController).post(createServiceController);

router
  .route("/:id")
  .put(updateServiceController)
  .delete(deleteServiceController);

export default router;
