import {Router} from "express";
import MediaRoutes from "./media.routes.js";
import { authenticateUser } from "../../helper/authMiddleware.js";


const router = Router();
router.use("/media", authenticateUser, MediaRoutes);

export default {
  init: (app) => app.use(router),
};
