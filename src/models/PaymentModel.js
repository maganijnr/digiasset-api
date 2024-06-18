import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
	{
		fullName: {
			type: String,
			required: [true, "Full name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
		},
		amount: {
			type: Number,
			required: [true, "Amount is required"],
		},
		// assets: {
		// 	type: [Schema.Types.ObjectId],
		// 	ref: "Asset",
		// 	required: [true, "Digital asset is required"],
		// },
		reference: {
			type: String,
			required: [true, "Payment reference is required"],
			unique: true,
		},
		status: {
			type: String,
			required: [true, "Payment status is required"],
		},

	},
	{
		timestamps: true,
	}
);

const PaymentModel = model("Payment", paymentSchema);

export default PaymentModel;
