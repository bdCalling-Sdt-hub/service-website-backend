import express from "express";

import authRouter from "./auth";
import serviceRouter from "./service";
import notificationRouter from "./notification";
import userRouter from "./user";
import subscriptionRouter from "./subscription";
import businessRouter from "./business";
import paymentRouter from "./payment";
import portfolioRouter from "./portfolio";
import reviewRouter from "./review";
import appDataRouter from "./appData";
import communicationRouter from "./communication";
import suburbRouter from "./suburb";
import bitRouter from "./bit";
import jobRouter from "./job";
import jobApplicationRouter from "./jobApplication";
import promotionRouter from "./promotion";
import referralRouter from "./referrals";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/services", serviceRouter);
router.use("/notifications", notificationRouter);
router.use("/users", userRouter);
router.use("/subscriptions", subscriptionRouter);
router.use("/businesses", businessRouter);
router.use("/payments", paymentRouter);
router.use("/portfolios", portfolioRouter);
router.use("/reviews", reviewRouter);
router.use("/app-data", appDataRouter);
router.use("/communications", communicationRouter);
router.use("/suburbs", suburbRouter);
router.use("/bits", bitRouter);
router.use("/jobs", jobRouter);
router.use("/job-applications", jobApplicationRouter);
router.use("/promotions", promotionRouter);
router.use("/referrals", referralRouter);

export default router;
