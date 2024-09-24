import { Router } from "express";
import { CheckController } from "../controllers/check.controller.js";
const router = Router();

router.route("/").get(CheckController);

export default router;
