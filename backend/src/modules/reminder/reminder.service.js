import {
  createReminderRepo,
  getReceivedRemindersRepo,
  getSentRemindersRepo,
  replyToReminderRepo,
  getReminderUsersRepo,
  checkIsUserExists,
} from '../../repository/reminder.repository.js';

export async function createReminderService(data) {
  await checkIsUserExists(data.to);
  return await createReminderRepo(data);
}

export async function getReceivedRemindersService(userId) {
  return await getReceivedRemindersRepo(userId);
}

export async function getSentRemindersService(userId) {
  return await getSentRemindersRepo(userId);
}

export async function replyToReminderService(id, response) {
  return await replyToReminderRepo(id, response);
}

export async function getReminderUsersService() {
  return await getReminderUsersRepo();
} 