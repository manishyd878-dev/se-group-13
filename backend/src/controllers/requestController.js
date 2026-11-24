import asyncHandler from 'express-async-handler';
import BloodRequest from '../models/BloodRequest.js';
import Hospital from '../models/Hospital.js';
import Notification from '../models/Notification.js';

// @desc    Create a blood request (patient -> hospital)
// @route   POST /api/requests
// @access  Private (patient)
export const createRequest = asyncHandler(async (req, res) => {
  const { hospital, bloodGroup, units, urgency, notes } = req.body;

  if (!hospital || !bloodGroup) {
    res.status(400);
    throw new Error('hospital and bloodGroup are required');
  }

  const hospitalDoc = await Hospital.findById(hospital);
  if (!hospitalDoc) {
    res.status(404);
    throw new Error('Hospital not found');
  }

  const request = await BloodRequest.create({
    patient: req.user._id,
    hospital,
    bloodGroup,
    units: units || 1,
    urgency: urgency || 'normal',
    notes,
  });

  await Notification.create({
    hospital,
    text: `New request from ${req.user.name} for ${bloodGroup} (${units || 1} unit${(units || 1) > 1 ? 's' : ''})`,
    tone: urgency === 'emergency' ? 'danger' : 'info',
  });

  res.status(201).json({ success: true, request });
});

// @desc    Get the logged-in patient's own requests
// @route   GET /api/requests/mine
// @access  Private (patient)
export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find({ patient: req.user._id })
    .populate('hospital', 'name address phone verified')
    .sort('-createdAt');

  res.json({ success: true, count: requests.length, requests });
});

// @desc    Get requests received by the logged-in hospital account
// @route   GET /api/requests/hospital
// @access  Private (hospital)
export const getHospitalRequests = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital?._id || req.user.hospital;
  if (!hospitalId) {
    res.status(400);
    throw new Error('This account is not linked to a hospital');
  }

  const requests = await BloodRequest.find({ hospital: hospitalId })
    .populate('patient', 'name email phone bloodGroup')
    .sort('-createdAt');

  res.json({ success: true, count: requests.length, requests });
});

// @desc    Update a request's status (accept / reject / fulfill / cancel)
// @route   PATCH /api/requests/:id/status
// @access  Private (owning hospital account for accept/reject/fulfill, patient for cancel)
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'accepted', 'rejected', 'fulfilled', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`status must be one of: ${validStatuses.join(', ')}`);
  }

  const request = await BloodRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  const isPatientOwner = request.patient.toString() === req.user._id.toString();
  const isHospitalOwner =
    req.user.hospital && request.hospital.toString() === req.user.hospital.toString();

  if (status === 'cancelled' && !isPatientOwner) {
    res.status(403);
    throw new Error('Only the requesting patient can cancel this request');
  }
  if (['accepted', 'rejected', 'fulfilled'].includes(status) && !isHospitalOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only the receiving hospital can update this request to that status');
  }

  request.status = status;
  await request.save();

  // If fulfilled, decrement hospital stock for that blood group
  if (status === 'fulfilled') {
    const hospital = await Hospital.findById(request.hospital);
    if (hospital) {
      const current = hospital.stock[request.bloodGroup] || 0;
      hospital.stock[request.bloodGroup] = Math.max(0, current - request.units);
      await hospital.save();
    }
  }

  await Notification.create({
    user: request.patient,
    text: `Your ${request.bloodGroup} request was marked "${status}"`,
    tone: status === 'fulfilled' ? 'success' : status === 'rejected' ? 'caution' : 'info',
  });

  res.json({ success: true, request });
});
