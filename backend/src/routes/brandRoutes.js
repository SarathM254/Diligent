import express from 'express';
import { getBrands, upsertBrand } from '../controllers/brandController.js';

const router = express.Router();

router.get('/', getBrands);
router.post('/upsert', upsertBrand);

export default router;
