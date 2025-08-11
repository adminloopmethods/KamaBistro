// middleware/authMiddleware.js
import {assert} from "../errors/assertError.js";

export const requireSuperAdmin = (req, res, next) => {
  assert(
    req.user?.isSuperUser,
    "FORBIDDEN",
    "Only super admins can perform this action"
  );
  next();
};
