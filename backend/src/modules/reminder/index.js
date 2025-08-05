import { Router } from 'express';
import ReminderRoutes from './reminder.routes.js';
import { authenticateUser } from '../../helper/authMiddleware.js'; // Uncomment if you want to protect routes

const router = Router();
router.use('/reminder', authenticateUser, ReminderRoutes);

export default {
  init: (app) => app.use(router),
}; 