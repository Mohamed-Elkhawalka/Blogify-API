import express from "express";

import {
createComment,
deleteComment,
} from "../controllers/comment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import { commentSchema } from "../validations/comment.validation.js";

const router = express.Router();

// Add comment to post
router.post(
"/posts/:postId/comments",
authMiddleware,
validate(commentSchema),
createComment
);

// Delete comment
router.delete(
"/comments/:id",
authMiddleware,
deleteComment
);

export default router;
