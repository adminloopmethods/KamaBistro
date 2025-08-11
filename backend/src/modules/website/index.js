import {Router} from "express";
import WebsiteRoutes from "./website.routes.js";
// import { authenticateUser } from "../../helper/authMiddleware.js";

const router = Router();
router.use("/website", WebsiteRoutes);

export default {
  init: (app) => app.use(router),
};
