import { Router } from 'express';
import {
  createRequest,
  getMyRequests,
  getHospitalRequests,
  updateRequestStatus,
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, authorize('patient'), createRequest);
router.get('/mine', protect, authorize('patient'), getMyRequests);
router.get('/hospital', protect, authorize('hospital', 'admin'), getHospitalRequests);
router.patch('/:id/status', protect, updateRequestStatus);

export default router;
