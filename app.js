import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);

// Error Middleware - must be last
app.use(errorMiddleware);

export default app;