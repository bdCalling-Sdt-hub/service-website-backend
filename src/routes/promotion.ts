import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  createPromotionController,
  deletePromotionController,
  getPromotionsController,
  getAllPromotionsController,
  approvePromotionController,
} from "../controllers/promotion";

const router = express.Router();

router
  .route("/")
  .all(authenticate("PROVIDER"))
  .get(getPromotionsController)
  .post(createPromotionController);

router.get("/all", authenticate("ADMIN"), getAllPromotionsController);

router
  .route("/:id")
  .patch(authenticate("ADMIN"), approvePromotionController)
  .delete(authenticate("PROVIDER"), deletePromotionController);

export default router;
