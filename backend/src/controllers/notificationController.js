import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Get notifications for the logged-in user (and their hospital, if any)
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital?._id || req.user.hospital;
  const or = [{ user: req.user._id }];
  if (hospitalId) or.push({ hospital: hospitalId });

  const notifications = await Notification.find({ $or: or }).sort('-createdAt').limit(50);

  res.json({ success: true, count: notifications.length, notifications });
});

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  const belongsToUser = notification.user && notification.user.toString() === req.user._id.toString();
  const belongsToHospital =
    notification.hospital && req.user.hospital && notification.hospital.toString() === req.user.hospital.toString();

  if (!belongsToUser && !belongsToHospital && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this notification');
  }

  notification.read = true;
  await notification.save();

  res.json({ success: true, notification });
});
