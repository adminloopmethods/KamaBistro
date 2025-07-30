import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  register,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", register);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", softDeleteUser);

export default router;