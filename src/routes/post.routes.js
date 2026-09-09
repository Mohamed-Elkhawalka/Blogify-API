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
import { postSchema } from "../validations/post.validation.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Create Post
router.post(
"/",
authMiddleware,
uploadSingle("coverImage"),
validate(postSchema),
createPost
);

// Get All Posts
router.get("/", getPosts);

// Get Single Post
router.get("/:id", getPost);

// Update Post
router.put(
"/:id",
authMiddleware,
uploadSingle("coverImage"),
validate(postSchema),
updatePost
);

// Delete Post
router.delete("/:id", authMiddleware, deletePost);

export default router;
