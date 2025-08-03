import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: "Too many requests from this IP, try again later.",
  headers: true,
});
