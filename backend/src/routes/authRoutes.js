import express from 'express';
import { verifyOwnerPIN, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/verify-owner', verifyOwnerPIN);
router.post('/google', googleLogin);

export default router;
