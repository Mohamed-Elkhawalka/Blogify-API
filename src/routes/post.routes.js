import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  postSchema,
  updatePostSchema,
} from "../validations/post.validation.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";
import asyncWrapper from "../utils/asyncWrapper.js";

const router = express.Router();

// Create Post
router.post(
  "/",
  authMiddleware,
  uploadSingle("coverImage"),
  validate(postSchema),
  asyncWrapper(createPost),
);

// Get All Posts
router.get("/", asyncWrapper(getPosts));

// Get Single Post
router.get("/:id", asyncWrapper(getPost));

// Update Post - Owner/Admin
router.put(
  "/:id",
  authMiddleware,
  uploadSingle("coverImage"),
  validate(updatePostSchema),
  asyncWrapper(updatePost),
);

// Delete Post - Owner/Admin
router.delete("/:id", authMiddleware, asyncWrapper(deletePost));

export default router;
