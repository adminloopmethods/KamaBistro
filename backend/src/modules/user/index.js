import {Router} from "express";
import UserRoutes from "./user.routes.js";
import {authenticateUser} from "../../helper/authMiddleware.js";

const router = Router();
router.use(
  "/user",
  authenticateUser,

  UserRoutes
);

export default {
  init: (app) => app.use(router),
};
