import express from "express";
import { getAllSalesmen, adjustLedgerBalance } from "../controllers/userController.js";

const router = express.Router();

router.get("/salesmen", getAllSalesmen);
router.patch("/adjust-balance", adjustLedgerBalance); 

export default router;
