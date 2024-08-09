import express from "express";
import { checkOut, topUpWallet } from "../Controllers/checkout.controller.js";

const router = express.Router();

router.post("/checkout", checkOut);
router.post("/topup-wallet", topUpWallet);

export default router;
