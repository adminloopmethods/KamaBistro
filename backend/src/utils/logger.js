import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function logActivity({ action, message, userId }) {
  try {
    await prisma.log.create({
      data: {
        action,
        message,
        userId,
      },
    });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
}

// logger.js
export function requestLogger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next(); // pass control to next middleware or route handler
}