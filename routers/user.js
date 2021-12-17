import express from "express";
const router = express.Router();
import { getUsers } from "../controllers/userController.js";

router.get("/", getUsers);

export default router;
