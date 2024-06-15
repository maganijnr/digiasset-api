import AssetModel from "../models/AssetModel.js";
import UserModel from "../models/UserModel.js";

export const getMyProfile = async (request, response) => {
	const { user } = request;

	if (!user) {
		return response.status(400).json({ error: "Not authorized" });
	}

	const userAssets = await AssetModel.find({
		creator: user._id,
	});

	const profile = await UserModel.findOne({ _id: user._id });

	return response.status(200).json({
		message: "Profile fetched successfully",
		profile: profile,
		assets: userAssets,
	});
};

export const updateMyProfile = async (request, response) => {
	const { user } = request;

	const updatedInfo = request.body;
	if (!user) {
		return response.status(400).json({ error: "Not authorized" });
	}

	const updatedProfile = await UserModel.findByIdAndUpdate(
		{ _id: user?._id },
		{ $set: updatedInfo },
		{ new: true }
	);

	if (!updatedProfile) {
		return response.status(400).json({ error: "Can't update profile" });
	}

	return response.status(201).json({
		message: "Profile updated successfully",
		profile: updatedProfile,
	});
};

export const getUserProfile = async (request, response) => {
	const { id } = request.params;

	const profile = await UserModel.findOne({ _id: id });

	const userAssets = await AssetModel.find({
		creator: id,
	});

	if (!profile) {
		return response.status(400).json({ error: "Profile not found" });
	}

	return response.status(200).json({
		message: "Profile fetched successfully",
		profile: profile,
		assets: userAssets,
	});
};
