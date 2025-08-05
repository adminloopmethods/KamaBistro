import { AppError } from "../errors/index.js";

const validate = (schema) => (req, res, next) => {
  try {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = [];
      error.details.map((detail) => messages.push(detail.message))
      throw new AppError(
        "VALIDATION_ERROR",
        messages
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
