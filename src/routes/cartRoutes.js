import express from "express";
import { verifyToken } from "../config/tokenConfig.js";
import {
	addItemToCart,
	deleteCartItem,
	getUserCartItems,
} from "../controllers/cartControllers.js";

const router = express.Router();

router
	.route("/cart")
	.post(verifyToken, addItemToCart)
	.get(verifyToken, getUserCartItems)
	.delete(verifyToken, deleteCartItem);

export default router;
