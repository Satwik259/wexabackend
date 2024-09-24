import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import multer from "multer";
const router = Router();
const upload = multer();
import { verifyJWT } from "../middleware/auth.middleware.js";

router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(upload.none(), verifyJWT, logoutUser);
router.route("/refresh-token").post(upload.none(), refreshAccessToken);

export default router;
