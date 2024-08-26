import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createMessageController,
  getMessagesController,
} from "../controllers/message";

const router = express.Router();

router
  .route("/")
  .get(authenticate("ADMIN", "PROVIDER"), getMessagesController)
  .post(authenticate("CUSTOMER"), createMessageController);

export default router;
