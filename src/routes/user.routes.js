import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateUserSchema } from "../validations/user.validation.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";
import asyncWrapper from "../utils/asyncWrapper.js";

const router = express.Router();

// Get all users - Admin only
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  asyncWrapper(getUsers),
);

// Get single user - Auth required
router.get("/:id", authMiddleware, asyncWrapper(getUser));

// Update user - Owner/Admin
router.put(
  "/:id",
  authMiddleware,
  uploadSingle("avatar"),
  validate(updateUserSchema),
  asyncWrapper(updateUser),
);

// Delete user - Admin only
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  asyncWrapper(deleteUser),
);

export default router;
