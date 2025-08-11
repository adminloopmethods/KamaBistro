import { Router } from "express";   
import UserRoutes from "./auth.routes.js";

const router = Router()
router.use("/auth", UserRoutes);

export default {
  init: (app) => app.use(router),
};
