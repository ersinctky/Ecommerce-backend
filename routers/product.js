import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
} from "../controllers/productController.js";
import { checkUserExist } from "../middlewares/database/databaseErrorHelpers.js";

router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
