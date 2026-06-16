import express from 'express';
import {
  createOrUpdateDraftBill,
  submitBill,
  updateBillStatusByOwner,
  getSalesmanBillHistory,
  getPendingBillsForAdmin,
  pushGlobalSystemDate,
  getGlobalSystemDate,
  getDashboardStats
} from '../controllers/billController.js';
import { verifyOwner } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createOrUpdateDraftBill);
router.get('/global-date', getGlobalSystemDate);
router.get('/dashboard-stats', verifyOwner, getDashboardStats);
router.post('/global-push-date', verifyOwner, pushGlobalSystemDate);
router.patch('/:id/submit', submitBill);
router.patch('/:id/status', verifyOwner, updateBillStatusByOwner);
router.get('/history/:salesmanId', getSalesmanBillHistory);
router.get('/admin/pending', verifyOwner, getPendingBillsForAdmin);

export default router;
