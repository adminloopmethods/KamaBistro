import express from "express";
import { createWebpage, getAllWebpages, getWebpageById, updateWebpageById } from "../controllers/contentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.use(authenticate);

router.get("/", getAllWebpages)
router.post("/", authenticate, createWebpage);
router.get("/:id", getWebpageById);
router.put("/:id", authenticate, updateWebpageById);

export default router;
