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
import addressRouter from "./address";
import messageRouter from "./message";
import appDataRouter from "./appData";

// import adRouter from "./ad";
// import musicRouter from "./music";

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
router.use("/addresses", addressRouter);
router.use("/messages", messageRouter);
router.use("/app-data", appDataRouter);

// router.use("/ads", adRouter);
// router.use("/musics", musicRouter);

export default router;
