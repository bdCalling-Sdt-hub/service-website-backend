import express from "express";
import { onlyAdmin } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createSubscriptionController,
  deleteSubscriptionController,
  getSubscriptionsController,
  updateSubscriptionController,
} from "../controllers/subscription";

const router = express.Router();

router
  .route("/")
  .post(createSubscriptionController)
  .get(getSubscriptionsController);

router
  .route("/:id")
  .put(updateSubscriptionController)
  .delete(deleteSubscriptionController);

export default router;
