import prismaClient from "../config/dbConfig.js";

export async function checkIsUserExists(to) {
  const user = await prismaClient.user.findUnique({
    where: { email: to },
    select: { email: true, status: true },
  });

  if (!user) {
    throw new Error('User not found');
  }
  if (user.status !== "ACTIVE") {
    throw new Error('User is blocked');
  }
  return true;
}

export async function createReminderRepo(data) {
  const { to, subject, message, sendOnEmail, senderId } = data;
  return await prismaClient.reminder.create({
    data: {
      senderId,
      receiverId: to,
      subject,
      message,
      sendOnEmail
    }
  });
}

export async function getReceivedRemindersRepo(userId) {
  return await prismaClient.reminder.findMany({
    where: { receiverId: userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getSentRemindersRepo(userId) {
  return await prismaClient.reminder.findMany({
    where: { senderId: userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function replyToReminderRepo(id, response) {
  return await prismaClient.reminder.update({
    where: { id },
    data: { replied: true, response },
  });
}

export async function getReminderUsersRepo() {
  return await prismaClient.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });
} 