import express from "express";
import { toastFetchController } from "./toast.controller.js";

const router = express.Router();

router.get("/", toastFetchController);

export default router;
