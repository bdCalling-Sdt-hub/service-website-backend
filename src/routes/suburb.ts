import express from "express";
import { getSuburbsController } from "../controllers/suburb";

const router = express.Router();

router.get("/", getSuburbsController);

export default router;
