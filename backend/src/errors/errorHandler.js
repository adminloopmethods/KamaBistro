import statusCodes from "./statusCodes.js";
import { logger } from "../config/index.js";
export const errorHandler = (err, req, res, next) => {
  const {
    statusCode = statusCodes.INTERNAL_SERVER_ERROR.code,
    errorType,
    message,
    errorDetails,
  } = err;

  // Log full stack trace only in development
  if (process.env.MODE === "development") {
    logger.error(err.stack);
    // console.log(err, "Error : ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  } else {
    logger.error(err.message);
  }

  res.status(statusCode).json({
    status: "error",
    errorType: errorType || err.error,
    statusCode,
    message: message || "Internal Server Error",
    errorDetails: errorDetails || "",
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(statusCodes.NOT_FOUND.code).json({
    status: "error",
    message: statusCodes.NOT_FOUND.message,
  });
};
