import express from "express";
import {
  createSubscriptionController,
  deleteSubscriptionController,
  getSubscriptionsController,
  updateSubscriptionController,
} from "../controllers/subscription";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router
  .route("/")
  .post(authenticate("ADMIN"), createSubscriptionController)
  .get(getSubscriptionsController);

router
  .route("/:id")
  .all(authenticate("ADMIN"))
  .put(updateSubscriptionController)
  .delete(deleteSubscriptionController);

export default router;
