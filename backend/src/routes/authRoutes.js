import express from "express";
import { register, login, updateUser, softDeleteUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/:id", updateUser);
router.delete("/:id", softDeleteUser);

export default router;
