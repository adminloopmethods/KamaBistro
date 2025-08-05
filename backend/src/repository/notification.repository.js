import exp from "constants";
import prismaClient from "../config/dbConfig.js";

import { findRoleTypeByUserId } from "./user.repository.js";

export const createNotification = async ({ userId, message }) => {
  const userrole = await findRoleTypeByUserId(userId);

  const notification = await prismaClient.notification.create({
    data: {
      userId,
      role: userrole?.roles[0]?.role?.roleType?.name,
      message,
    },
  });

  return notification;
};

export const findAllNotification = async (
  userId,
  page = 1,
  limit = 10,
  search = "",
  filters = {}
) => {
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(search && {
      OR: [
        { message: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } }
      ]
    }),
    ...filters
  }

  const [notifications, total] = await Promise.all([
    prismaClient.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prismaClient.notification.count({ where })
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };


  // PREVIOUS CODE
  // const notification = await prismaClient.notification.findMany({
  //   where: {
  //     userId,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });

  // return notification;
};

export const markNotificationAsRead = async (notificationId) => {
  const notification = await prismaClient.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });

  return notification;
};

export const markAllNotificationAsRead = async (userId) => {
  const result = await prismaClient.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  const notifications = await findAllNotification(userId);

  return notifications; // contains { count: X }
};

export const deleteNotification = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // const twoMinutesAgo = new Date();
  // twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);

  const deletedNotifications = await prismaClient.notification.deleteMany({
    where: {
      createdAt: {
        lt: sevenDaysAgo,
        // lt: twoMinutesAgo,
      },
    },
  });

  return deletedNotifications;
};

export const deleteAllNotificationBy = async (id) =>{
  const deletedNotifications =await prismaClient.notification.deleteMany({
    where: {userId : id},
  });

  return deletedNotifications;
}
