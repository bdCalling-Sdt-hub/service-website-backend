import express from "express";
// import { allRegisteredUser, onlyArtist } from "../middlewares/isAllowedUser";
import {
  createServiceController,
  getServicesController,
  deleteServiceController,
  updateServiceController,
} from "../controllers/service";
import authenticate from "../middlewares/authenticate";
import upload from "../middlewares/upload";

const router = express.Router();

router
  .route("/")
  .get(getServicesController)
  .post(authenticate("ADMIN"), upload.single("image"), createServiceController);

router
  .route("/:id")
  .all(authenticate("ADMIN"))
  .put(upload.single("image"), updateServiceController)
  .delete(deleteServiceController);

export default router;
