import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit the contact form
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('name, email and message are required');
  }

  const entry = await ContactMessage.create({ name, email, subject, message });

  res.status(201).json({ success: true, message: 'Message received', contact: entry });
});
