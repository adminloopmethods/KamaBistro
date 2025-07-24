import express from "express";
import {
  deleteAllUsers,
  deleteAllContent,
  nukeAllUsersAndContent,
} from "../controllers/adminController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.use(authenticate); // Protect all admin delete endpoints


router.delete("/users", deleteAllUsers);
router.delete("/content", deleteAllContent);
router.delete("/nuke", nukeAllUsersAndContent);

export default router;
