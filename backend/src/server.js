import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

// middleware
import corsOptions from "./config/corsOptions.js";
import { requestLogger } from "./utils/logger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandlers.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import { logActivity } from "./utils/logger.js";

// routes
import contentRoutes from "./routes/contentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Security and rate limit
app.use(helmet());
app.use(globalRateLimiter);

// Logger and JSON parser
app.use(requestLogger);
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/content", contentRoutes);
app.use("/logs", logRoutes);

// 404 Handler — keep after routes
app.use(notFoundHandler);

// Error handler — keep after all middleware
app.use(errorHandler);

// Start the server at the end
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("uncaughtException", async (err) => {
  await logActivity({
    action: "UNCAUGHT_EXCEPTION",
    message: err.stack || err.message,
    userId: null,
  });
  process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
  await logActivity({
    action: "UNHANDLED_REJECTION",
    message: reason?.stack || reason?.message || JSON.stringify(reason),
    userId: null,
  });
});