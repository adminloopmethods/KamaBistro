import {Router} from "express";
import ContentRoutes from "./content.routes.js";
import { authenticateUser } from "../../helper/authMiddleware.js";


const router = Router();
router.use("/content", authenticateUser, ContentRoutes);

export default {
  init: (app) => app.use(router),
};
