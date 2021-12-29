import express from "express";
const router = express.Router();
import {
  getUserProfile,
  getUsers,
  updateUserProfile,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { getAccessToRoute, admin } from "../middlewares/authorization/auth.js";

router.route("/").get(getAccessToRoute, admin, getUsers);
router
  .route("/profile")
  .get(getAccessToRoute, getUserProfile)
  .put(getAccessToRoute, updateUserProfile);

router
  .route("/:id")
  .delete(getAccessToRoute, admin, deleteUser)
  .get(getAccessToRoute, admin, getUserById)
  .put(getAccessToRoute, admin, updateUser);
export default router;
