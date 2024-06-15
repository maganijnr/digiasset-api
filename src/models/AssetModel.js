import { Schema, model } from "mongoose";

const assetModel = new Schema(
	{
		name: {
			type: String,
			required: [true, "Digital asset name is required"],
		},
		description: {
			type: String,
			required: [true, "Digital asset description is required"],
		},
		coverImage: {
			type: String,
			required: [true, "Digital asset cover image is required"],
		},
		images: {
			type: [String],
			required: [true, "Digital asset images are required"],
		},
		categories: {
			type: [String],
			required: [true, "Digital asset category is required"],
		},
		price: {
			type: Number,
			required: [true, "Digital asset price is required"],
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Digital asset creator is required"],
		},
	},
	{ timestamps: true }
);

const AssetModel = model("Asset", assetModel);

export default AssetModel;
