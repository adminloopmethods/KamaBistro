import { Router } from 'express';
import * as ReminderController from './reminder.controller.js';
import tryCatchWrap from "../../errors/tryCatchWrap.js";

const router = Router();

// Create a new reminder
router.post('/create', tryCatchWrap(ReminderController.createReminder));
// Get received reminders for a user
router.get('/received', tryCatchWrap(ReminderController.getReceivedReminders));
// Get sent reminders for a user
router.get('/sent', tryCatchWrap(ReminderController.getSentReminders));
// Reply to a reminder
router.post('/reply/:id', tryCatchWrap(ReminderController.replyToReminder));
// Get all users for reminders
router.get('/users', tryCatchWrap(ReminderController.getReminderUsers));

export default router; 