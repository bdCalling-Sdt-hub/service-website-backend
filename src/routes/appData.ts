import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  getAppDataController,
  getHTMLController,
  privacyPolicy,
  updateAppDataController,
} from "../controllers/appData";

const router = express.Router();

router
  .route("/")
  .get(getAppDataController)
  .put(authenticate("ADMIN"), updateAppDataController);

  router.get("/:page",getHTMLController)
  router.get("/privacy-policy.html",privacyPolicy)

export default router;
