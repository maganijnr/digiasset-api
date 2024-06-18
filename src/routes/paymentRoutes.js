import express from "express";
import {
	createAssetPurchase,
	paymentReciept,
	startAssetPurchase,
} from "../controllers/paymentController.js";
import { verifyToken } from "../config/tokenConfig.js";

const router = express.Router();

router.post("/", verifyToken, startAssetPurchase);
router.get("/createPayment", verifyToken, createAssetPurchase);
router.get("/paymentDetails", verifyToken, paymentReciept);

export default router;
