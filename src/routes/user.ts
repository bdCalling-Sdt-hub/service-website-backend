import express from "express";
import {
  updateUserController,
  changePasswordController,
  getUsersController,
} from "../controllers/user";
import upload from "../middlewares/upload";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.route("/").get(authenticate("ADMIN"), getUsersController);

router
  .route("/:userId")
  .all(authenticate())
  .put(upload.single("image"), updateUserController)
  .patch(changePasswordController);

export default router;
