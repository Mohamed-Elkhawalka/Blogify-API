import express from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import asyncWrapper from "../utils/asyncWrapper.js";

const router = express.Router();

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts, please try again later",
  },
});

// Register
router.post("/register", validate(registerSchema), asyncWrapper(register));

// Login
router.post("/login", loginLimiter, validate(loginSchema), asyncWrapper(login));

export default router;
