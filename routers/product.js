import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  getTopProducts,
  createProduct,
  createProductReview,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { admin, getAccessToRoute } from "../middlewares/authorization/auth.js";

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/top", getTopProducts);

router.post("/", getAccessToRoute, admin, createProduct);
router.post("/:id/reviews", getAccessToRoute, createProductReview);

router.put("/:id", getAccessToRoute, admin, updateProduct);

router.delete("/:id", admin, deleteProduct);

export default router;
