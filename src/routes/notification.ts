import express from "express";
import { userNotificationsController } from "../controllers/notification";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.get(
  "/",
  authenticate(),
  userNotificationsController
);

export default router;
