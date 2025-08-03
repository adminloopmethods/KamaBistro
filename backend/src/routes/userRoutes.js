import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  register,
  toggleStatus,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/switchStatus/:id", toggleStatus)
router.delete("/:id", softDeleteUser);

export default router;