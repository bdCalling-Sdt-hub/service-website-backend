import express from "express";
import {
  createSubscriptionController,
  deleteSubscriptionController,
  getSubscriptionsController,
  updateSubscriptionController,
  currentSubscriptionController,
} from "../controllers/subscription";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router
  .route("/")
  .post(authenticate("ADMIN"), createSubscriptionController)
  .get(getSubscriptionsController);

router
  .route("/current")
  .get(authenticate("PROVIDER"), currentSubscriptionController);

router
  .route("/:id")
  .all(authenticate("ADMIN"))
  .put(updateSubscriptionController)
  .delete(deleteSubscriptionController);

export default router;
