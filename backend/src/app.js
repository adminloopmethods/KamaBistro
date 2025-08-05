import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {serverStatus} from "./other/serverStatus.js";
import * as path from "path";
import {errorHandler, notFoundHandler} from "./errors/index.js"; // Custom error handler
import {logger, morganMiddleware} from "./config/index.js";
import cookieParser from "cookie-parser";

import helmet from "helmet";
import auditLogger from "./helper/auditLogger.js";
import {globalRateLimiter} from "./helper/rateLimiter.js";
import swaggerSpec from "./config/swaggerConfig.js";
import swaggerUi from "swagger-ui-express";
import {fileURLToPath} from "url";
export const createApp = () => {
  const app = express();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Middleware setup
  app.use(
    cors({
      origin: JSON.parse(process.env.CORS_ORIGIN),
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );

  // Body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // Use the Morgan middleware for logging HTTP requests
  app.use(morganMiddleware);

  // Rate limiter middleware
  app.use(globalRateLimiter);

  // Use cookie parser
  app.use(cookieParser());

  // Helmet secure Express apps by setting various HTTP headers
  app.use(helmet());

  // Serve static files
  app.use(express.static(path.resolve("public")));

  // Health check route
  app.use("/healthy", (req, res) => res.send(serverStatus()));

  // swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Multer for file uploads (if needed)
  app.use("/uploads", express.static(path.join(__dirname, "uploads", "pdfs")));

  // console.log("swagger", swaggerSpec);

  // Log Middleware for audit logging
  // app.use(auditLogger);

  return app;
};

// Global error handling
export const finishApp = (app) => {
  // Global error logging for uncaught exceptions and unhandled promise rejections
  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1); // Optional: Exit after logging critical errors
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

  // Custom error handler for routes inside the app
  app.use(notFoundHandler); // Handles undefined routes and sends a 404 response
  app.use(errorHandler); // Logs errors and sends a 500 response
};
