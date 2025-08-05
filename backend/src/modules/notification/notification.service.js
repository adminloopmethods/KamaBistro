import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";

import {
  deleteAllNotificationBy,
  findAllNotification,
  markAllNotificationAsRead,
  markNotificationAsRead,
} from "../../repository/notification.repository.js";

const getAllNotification = async (id, page, limit, search) => {
  const notifications = await findAllNotification(id, page, limit, search);
  // if response is empty the throw error with assert
  assert(notifications, "FETCHING_FAILED", "something went wrong");
  //log information
  logger.info({ response: "Fetched successfully" });
  return {
    message: "notification fetched successfully",
    notifications,
    ok: true,
  }; // if everything goes fine
};

const markNotification = async (id) => {
  const mark = await markNotificationAsRead(id);
  // if response is empty the throw error with assert
  assert(mark, "MARK_FAILED", "something went wrong");
  //log information
  logger.info({ response: "Fetched successfully" });
  return {
    message: "notification read successfully",
    mark,
    ok: true,
  }; // if everything goes fine
};

const markAllNotification = async (id) => {
  const markAll = await markAllNotificationAsRead(id);
  // if response is empty the throw error with assert
  assert(markAll, "MARK_FAILED", "something went wrong");
  //log information
  logger.info({ response: "Fetched successfully" });
  return {
    message: "all notifications read successfully",
    markAll,
    ok: true,
  }; // if everything goes fine
};

const clearAllNotification = async (id) =>{
const clearedNotifications = await deleteAllNotificationBy(id);
logger.info({clearAllNotification: "Notifications deleted successfully"})
return {
  message : "All notifications deleted successfully"
}
}

export { getAllNotification, markNotification, markAllNotification, clearAllNotification };
