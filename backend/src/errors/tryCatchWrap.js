import handlePrismaError from "./prismaErrorHandler.js";

const tryCatchWrap = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    handlePrismaError(error, next);
  }
};

export default tryCatchWrap; // Export the function for global use
