import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createPromotionController,
  deletePromotionController,
  getPromotionsController,
} from "../controllers/promotion";

const router = express.Router();

router
  .route("/")
  .all(authenticate("PROVIDER"))
  .get(getPromotionsController)
  .post(createPromotionController);
  
router.delete("/:id", authenticate("PROVIDER"), deletePromotionController);

export default router;
