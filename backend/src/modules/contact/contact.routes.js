import express from "express";
import { submitContactForm } from "./contact.controller.js";

const router = express.Router();

router.post("/", submitContactForm);

export default router;
