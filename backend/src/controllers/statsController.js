import asyncHandler from 'express-async-handler';
import Hospital, { BLOOD_GROUPS } from '../models/Hospital.js';
import BloodRequest from '../models/BloodRequest.js';

// @desc    Aggregate platform stats for the homepage counters
// @route   GET /api/stats
// @access  Public
export const getStats = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find().lean();

  const hospitalsConnected = hospitals.length;
  const bloodUnitsAvailable = hospitals.reduce(
    (sum, h) => sum + BLOOD_GROUPS.reduce((s, g) => s + (h.stock?.[g] || 0), 0),
    0
  );

  const successfulDonations = await BloodRequest.countDocuments({ status: 'fulfilled' });
  const livesSaved = successfulDonations; // simple 1:1 proxy metric

  res.json({
    success: true,
    stats: [
      { label: 'Hospitals connected', value: hospitalsConnected, suffix: '+' },
      { label: 'Blood units available', value: bloodUnitsAvailable, suffix: '+' },
      { label: 'Successful donations', value: successfulDonations, suffix: '+' },
      { label: 'Lives saved', value: livesSaved, suffix: '+' },
    ],
  });
});
