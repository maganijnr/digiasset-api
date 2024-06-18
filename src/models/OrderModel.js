import { Schema, model } from "mongoose";

const orderSchema = new Schema(
	{
		assets: {
			type: [Schema.Types.ObjectId],
			ref: "Asset",
			required: [true, "Digital asset is required"],
		},
		reference: {
			type: String,
			required: [true, "Payment reference is required"],
			unique: true,
		},
		status: {
			type: String,

			default: "processing",
		},
		totalAmount: {
			type: Number,
			required: [true, "Total amount is required"],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User is required"],
		},
	},
	{ timestamps: true }
);

const OrderModel = model("Order", orderSchema);

export default OrderModel;
