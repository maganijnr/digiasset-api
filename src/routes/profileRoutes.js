import express from "express";
import { verifyToken } from "../config/tokenConfig.js";
import {
	getMyProfile,
	getUserProfile,
	updateMyProfile,
} from "../controllers/profileControllers.js";

const router = express.Router();

router
	.route("/profile")
	.get(verifyToken, getMyProfile)
	.put(verifyToken, updateMyProfile);


router.get("/profile/user/:id", verifyToken, getUserProfile);

export default router;
