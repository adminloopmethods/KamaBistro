import express from "express";
import { createWebpage, getAllWebpages, getWebpageById, updateWebpageById } from "../controllers/contentController.js";

const router = express.Router();

router.post("/", createWebpage);
router.get("/", getAllWebpages)
router.get("/:id", getWebpageById);
router.put("/:id", updateWebpageById);

export default router;
