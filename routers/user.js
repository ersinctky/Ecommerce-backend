import express from "express";
const router = express.Router();
import { getUsers } from "../controllers/userController.js";
import { checkUserExist } from "../middlewares/database/databaseErrorHelpers.js";

router.get("/", getUsers);

export default router;
