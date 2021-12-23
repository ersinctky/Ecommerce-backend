import express from "express";
const router = express.Router();
import {
  registerUser,
  login,
  logout,
  imageUpload,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";
import { getAccessToRoute } from "../middlewares/authorization/auth.js";
import { profileImageUpload } from "../middlewares/libraries/profileImageUpload.js";

router.post("/register", registerUser);
router.post("/login", login);
router.get("logout", logout);
router.post(
  "/upload",
  [getAccessToRoute, profileImageUpload.single("profile_image")],
  imageUpload
);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);

export default router;
