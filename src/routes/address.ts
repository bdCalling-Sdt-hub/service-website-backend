import express from "express";
import {
  getAddressesController,
  getStatesController,
} from "../controllers/address";

const router = express.Router();

router.get("/", getAddressesController);
router.get("/state", getStatesController);

export default router;
