import { Schema, model } from "mongoose";

const cartModel = new Schema(
	{
		cartItems: {
			type: [Schema.Types.ObjectId],
			ref: "Asset",
		},
		
		creator: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Digital asset creator is required"],
		},
	},
	{ timestamps: true }
);

const CartModel = model("Cart", cartModel);

export default CartModel;
