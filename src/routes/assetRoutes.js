import express from "express";
import {
	createDigitalAsset,
	getAllAssets,
	getAssetById,
	updateDigitalAsset,
} from "../controllers/assetControllers.js";
import { verifyToken } from "../config/tokenConfig.js";

const router = express.Router();

router.route("/assets/create").post(verifyToken, createDigitalAsset);
router.route("/assets").get(getAllAssets);
router.route("/assets/:id").get(getAssetById);
router.route("/assets/update/:id").put(verifyToken, updateDigitalAsset);

export default router;
