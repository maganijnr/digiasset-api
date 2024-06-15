import { Schema, model } from "mongoose";

const userModel = new Schema(
	{
		fullName: {
			type: String,
			required: [true, "Full name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		imageUrl: {
			type: String,
			default:
				"https://res.cloudinary.com/dycw4c4f6/image/upload/v1717744416/phpv7brcg0xleu64fr36.png",
		},
		role: {
			type: String,
			default: "USER",
		},
	},
	{ timestamps: true }
);

const UserModel = model("User", userModel);

export default UserModel;
