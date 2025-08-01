import express from "express";
import { deleteLogsByDateRange } from "../controllers/logsController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/")
router.post("/delete", authenticate, authorizeAdmin, deleteLogsByDateRange);

export default router;
