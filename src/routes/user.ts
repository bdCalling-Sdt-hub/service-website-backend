import express from "express";
import {
  updateUserController,
  changePasswordController,
  getUsersController,
  getTotalCustomerAndProviderController,
  deleteUserController,
  unsubscribeController,
} from "../controllers/user";
import upload from "../middlewares/upload";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.route("/").get(authenticate("ADMIN"), getUsersController);

router.get(
  "/total",
  authenticate("ADMIN"),
  getTotalCustomerAndProviderController
);

router
  .route("/:userId")
  .put(authenticate(), upload.single("image"), updateUserController)
  .patch(authenticate(), changePasswordController)
  .delete(authenticate("ADMIN"), deleteUserController);

router.get("/:userId/unsubscribe", unsubscribeController);

export default router;
