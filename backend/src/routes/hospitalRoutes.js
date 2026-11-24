import { Router } from 'express';
import {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  updateStock,
} from '../controllers/hospitalController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getHospitals);
router.get('/:id', getHospital);
router.post('/', protect, authorize('hospital', 'admin'), createHospital);
router.put('/:id', protect, authorize('hospital', 'admin'), updateHospital);
router.delete('/:id', protect, authorize('hospital', 'admin'), deleteHospital);
router.patch('/:id/stock', protect, authorize('hospital', 'admin'), updateStock);

export default router;
