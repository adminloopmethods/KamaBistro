import { Router } from "express";
import toastRoutes from "./toast.routes.js"


const router = Router();
router.use("/toast", toastRoutes);

export default {
    init: (app) => app.use(router),
};
