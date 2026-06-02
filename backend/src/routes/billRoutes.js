import express from 'express';
import {
  createOrUpdateDraftBill,
  submitBill,
  updateBillStatusByOwner,
  getSalesmanBillHistory,
  getPendingBillsForAdmin
} from '../controllers/billController.js';

const router = express.Router();

router.post('/', createOrUpdateDraftBill);
router.patch('/:id/submit', submitBill);
router.patch('/:id/status', updateBillStatusByOwner);
router.get('/history/:salesmanId', getSalesmanBillHistory);
router.get('/admin/pending', getPendingBillsForAdmin);

export default router;
