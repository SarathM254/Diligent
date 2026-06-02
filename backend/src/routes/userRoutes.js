import express from "express";
import { getAllSalesmen, adjustLedgerBalance, getAllOperators, registerUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/salesmen", getAllSalesmen);
router.get("/operators", getAllOperators);
router.post("/register", registerUser);
router.patch("/adjust-balance", adjustLedgerBalance); 

export default router;
