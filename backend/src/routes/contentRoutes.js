import express from "express";
import { createWebpage, getAllWebpages, getWebpageById, updateWebpageById } from "../controllers/contentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate); 

router.post("/", createWebpage);
router.get("/", getAllWebpages)
router.get("/:id", getWebpageById);
router.put("/:id", updateWebpageById);

export default router;
