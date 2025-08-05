import { Router } from "express";   
import RolesRoutes from "./permission.routes.js";
import { authenticateUser } from "../../helper/authMiddleware.js";


const router = Router()
router.use("/permission", authenticateUser, RolesRoutes);

export default {
  init: (app) => app.use(router),
};
