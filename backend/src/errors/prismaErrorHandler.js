import { Prisma } from "@prisma/client";
import AppError from "./AppError.js"; // import your AppError class

// Handle specific Prisma errors
const handlePrismaError = (error, next) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Known request errors (like constraint violations)
    if (error.code === "P2002") {
      throw new AppError("BAD_REQUEST", "Unique constraint failed", error.meta);
    }
    if (error.code === "P2003") {
      throw new AppError(
        "BAD_REQUEST",
        "Foreign key constraint failed",
        error.meta
      );
    }
    // Handle other Prisma-specific errors as needed
    throw new AppError(
      "BAD_REQUEST",
      "Prisma client known error occurred",
      error.meta
    );
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // Unknown errors
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      "Unknown Prisma request error occurred",
      error.meta
    );
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    // Validation errors from Prisma client
    throw new AppError(
      "BAD_REQUEST",
      "Prisma client validation error",
      error.meta
    );
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    // Initialization errors (like connection issues)
    throw new AppError(
      "SERVICE_UNAVAILABLE",
      "Prisma client initialization error",
      error.meta
    );
  }

  next(error);
};

export default handlePrismaError;
