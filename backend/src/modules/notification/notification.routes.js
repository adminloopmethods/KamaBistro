import { Router } from "express";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import notificationController from "./notification.controller.js";
const router = Router();

router.get("/:id", tryCatchWrap(notificationController.GetAllNotification)); // get all notifications

router.put("/read/:id", tryCatchWrap(notificationController.MarkNotification)); // mark single notification as read

router.put(
  "/read-all/:id",
  tryCatchWrap(notificationController.MarkAllNotification)
); // mark all notification as read

router.delete(
  "/clear-all/:id",
  tryCatchWrap(notificationController.ClearAllNotification)
)

export default router;
