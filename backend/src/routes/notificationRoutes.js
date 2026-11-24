import { Router } from 'express';
import { getNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markNotificationRead);

export default router;
