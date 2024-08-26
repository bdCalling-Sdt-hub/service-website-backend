import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  getAppDataController,
  updateAppDataController,
} from "../controllers/appData";

const router = express.Router();

router
  .route("/")
  .get(getAppDataController)
  .put(authenticate("ADMIN"), updateAppDataController);

router.get("/about.html")
router.get("/privacy.html")
router.get("/terms.html")

export default router;
