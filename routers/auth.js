import express from "express";
const router = express.Router();
import { registerUser, login, logout } from "../controllers/authController.js";

router.post("/register", registerUser);
router.post("/login", login);
router.get("logout", logout);

export default router;
