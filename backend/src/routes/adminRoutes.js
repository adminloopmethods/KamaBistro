import express from "express";
import {
  deleteAllUsers,
  deleteAllContent,
  nukeAllUsersAndContent,
} from "../controllers/adminController.js";

const router = express.Router();

router.delete("/users", deleteAllUsers);
router.delete("/content", deleteAllContent);
router.delete("/nuke", nukeAllUsersAndContent);

export default router;
