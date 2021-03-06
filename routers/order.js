import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
} from "../controllers/orderController.js";
import { getAccessToRoute, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(getAccessToRoute, addOrderItems)
  .get(protect, admin, getOrders);
router.route("/:id").get(getAccessToRoute, getOrderById);

router.route("/myorders").get(getAccessToRoute, getMyOrders);

export default router;
