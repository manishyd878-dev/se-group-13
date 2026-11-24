import asyncHandler from 'express-async-handler';
import Hospital, { BLOOD_GROUPS } from '../models/Hospital.js';
import Notification from '../models/Notification.js';

// Haversine distance in km between two [lng, lat] points
function distanceKm([lng1, lat1], [lng2, lat2]) {
  if ((lng1 === 0 && lat1 === 0) || (lng2 === 0 && lat2 === 0)) return null;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// @desc    List hospitals with optional search / blood-group / distance filters
// @route   GET /api/hospitals?q=&bloodGroup=&maxDistanceKm=&lat=&lng=&verifiedOnly=
// @access  Public
export const getHospitals = asyncHandler(async (req, res) => {
  const { q, bloodGroup, maxDistanceKm, lat, lng, verifiedOnly } = req.query;

  const filter = {};
  if (q) {
    filter.$or = [
      { name: new RegExp(q, 'i') },
      { address: new RegExp(q, 'i') },
      { city: new RegExp(q, 'i') },
    ];
  }
  if (verifiedOnly === 'true') {
    filter.verified = true;
  }

  let hospitals = await Hospital.find(filter).lean({ virtuals: true });

  const hasOrigin = lat !== undefined && lng !== undefined;
  if (hasOrigin) {
    const origin = [parseFloat(lng), parseFloat(lat)];
    hospitals = hospitals.map((h) => ({
      ...h,
      distanceKm: distanceKm(origin, h.location?.coordinates || [0, 0]),
    }));

    if (maxDistanceKm) {
      const max = parseFloat(maxDistanceKm);
      hospitals = hospitals.filter((h) => h.distanceKm === null || h.distanceKm <= max);
    }

    hospitals.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  }

  if (bloodGroup && BLOOD_GROUPS.includes(bloodGroup)) {
    hospitals.sort((a, b) => (b.stock?.[bloodGroup] || 0) - (a.stock?.[bloodGroup] || 0));
  }

  res.json({ success: true, count: hospitals.length, hospitals });
});

// @desc    Get a single hospital
// @route   GET /api/hospitals/:id
// @access  Public
export const getHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }
  res.json({ success: true, hospital });
});

// @desc    Create a hospital record
// @route   POST /api/hospitals
// @access  Private (hospital, admin)
export const createHospital = asyncHandler(async (req, res) => {
  const { name, address, city, phone, email, rating, verified, location, stock } = req.body;

  const hospital = await Hospital.create({
    name,
    address,
    city,
    phone,
    email,
    rating,
    verified: req.user.role === 'admin' ? verified : false,
    location,
    stock,
    owner: req.user._id,
  });

  res.status(201).json({ success: true, hospital });
});

// @desc    Update hospital details
// @route   PUT /api/hospitals/:id
// @access  Private (owning hospital account, admin)
export const updateHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }

  const isOwner = hospital.owner && hospital.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this hospital');
  }

  const { name, address, city, phone, email, rating, location, verified } = req.body;
  if (name !== undefined) hospital.name = name;
  if (address !== undefined) hospital.address = address;
  if (city !== undefined) hospital.city = city;
  if (phone !== undefined) hospital.phone = phone;
  if (email !== undefined) hospital.email = email;
  if (rating !== undefined) hospital.rating = rating;
  if (location !== undefined) hospital.location = location;
  if (verified !== undefined && req.user.role === 'admin') hospital.verified = verified;

  await hospital.save();
  res.json({ success: true, hospital });
});

// @desc    Delete a hospital
// @route   DELETE /api/hospitals/:id
// @access  Private (owning hospital account, admin)
export const deleteHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }

  const isOwner = hospital.owner && hospital.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this hospital');
  }

  await hospital.deleteOne();
  res.json({ success: true, message: 'Hospital deleted' });
});

// @desc    Update blood stock for a hospital (absolute set or +/- delta per group)
// @route   PATCH /api/hospitals/:id/stock
// @access  Private (owning hospital account, admin)
// @body    { "mode": "delta" | "set", "changes": { "O+": 1, "A-": -1 } }
export const updateStock = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }

  const isOwner = hospital.owner && hospital.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this hospital\'s stock');
  }

  const { mode = 'delta', changes = {} } = req.body;
  const lowStockGroups = [];

  for (const [group, value] of Object.entries(changes)) {
    if (!BLOOD_GROUPS.includes(group)) continue;
    const current = hospital.stock[group] || 0;
    const next = mode === 'set' ? Number(value) : current + Number(value);
    hospital.stock[group] = Math.max(0, next);

    if (hospital.stock[group] < 5) {
      lowStockGroups.push(group);
    }
  }

  await hospital.save();

  // Auto-generate a low-stock notification for the hospital dashboard
  if (lowStockGroups.length > 0) {
    await Notification.create({
      hospital: hospital._id,
      text: `${lowStockGroups.join(', ')} stock is running low (under 5 units)`,
      tone: 'caution',
    });
  }

  res.json({ success: true, hospital });
});
