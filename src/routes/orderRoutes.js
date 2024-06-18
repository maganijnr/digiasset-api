import express from "express";
import { verifyToken } from "../config/tokenConfig.js";
import {
	createAssetOrder,
	getAllUserOrders,
	retryUserOrderVerify,
	verifyUserOrder,
} from "../controllers/orderControllers.js";

const router = express.Router();

router.post("/place-order", verifyToken, createAssetOrder);
router.get("/verify-order", verifyToken, verifyUserOrder);
router.get('/retry-order', verifyToken, retryUserOrderVerify)

router.get("/user-orders", verifyToken, getAllUserOrders);

export default router;
