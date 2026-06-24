import express from 'express';
import multer from 'multer';
import { submitPayment, getMyPayments, deletePayment, submitAllPayments } from '../controllers/salesmanUpiController.js';
import { getAllPayments, verifyPaymentManual, getDashboardStats, archiveAllPayments } from '../controllers/ownerUpiController.js';
import { reconcileStatement, getStatementsHistory } from '../controllers/reconciliationController.js';

// If Diligent has auth middleware, you would import it here.
// e.g., import { protect, authorize } from '../middlewares/authMiddleware.js';
import { verifyOwner } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- Salesman Routes ---
// Base: /api/upi/salesman
router.post('/salesman/payments', submitPayment);
router.get('/salesman/payments', getMyPayments);
router.delete('/salesman/payments/:id', deletePayment);
router.post('/salesman/payments/submit-all', submitAllPayments);

// --- Owner Routes ---
// Base: /api/upi/owner
router.get('/owner/payments', verifyOwner, getAllPayments);
router.put('/owner/payments/:id/verify', verifyOwner, verifyPaymentManual);
router.get('/owner/dashboard/stats', verifyOwner, getDashboardStats);
router.post('/owner/payments/archive', verifyOwner, archiveAllPayments);

// --- Reconciliation (Owner) ---
router.post('/owner/reconciliation/upload', verifyOwner, upload.single('statement'), reconcileStatement);
router.get('/owner/reconciliation/statements', verifyOwner, getStatementsHistory);

export default router;
