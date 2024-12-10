import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createReferralController,
  getReferralsController,
} from "../controllers/referrals";

const router = express.Router();

router
  .route("/")
  .get(authenticate("PROVIDER"), getReferralsController)
  .post(authenticate("CUSTOMER", "PROVIDER"), createReferralController);

export default router;
