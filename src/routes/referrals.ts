import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createReferralController,
  getReferralsController,
  getRefersController,
} from "../controllers/referrals";

const router = express.Router();

router
  .route("/")
  .get(authenticate("PROVIDER"), getReferralsController)
  .post(authenticate("CUSTOMER", "PROVIDER"), createReferralController);

router.route("/refers").get(authenticate("ADMIN"), getRefersController);

export default router;
