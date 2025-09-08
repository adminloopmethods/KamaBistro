import { Router } from "express";
import ContactRoutes from "./contact.routes.js"


const router = Router();
router.use("/contact", ContactRoutes);

export default {
  init: (app) => app.use(router),
};
