import { generateToken } from "../config/tokenConfig.js";
import { validateSignIn, validateSignUp } from "../helpers/validateAuth.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const signInUser = async (request, response) => {
	const { email, password } = request.body;

	const errorCheck = validateSignIn(email, password);

	if (errorCheck) {
		return response.status(400).json({ error: errorCheck.message });
	}

	//Check if user exists
	const userExist = await UserModel.findOne({ email: email });

	if (!userExist) {
		return response.status(400).json({ error: "User does not exist" });
	}

	const comparePasswords = await bcrypt.compare(password, userExist.password);

	if (!comparePasswords) {
		return response.status(400).json({ error: "Invalid password" });
	}

	const token = generateToken(userExist.fullName, userExist._id);

	return response.status(201).json({
		message: "Sign in successful",
		user: {
			email: userExist.email,
			fullName: userExist.fullName,
			imageUrl: userExist.imageUrl,
		},
		accessToken: token,
	});
};

export const signUpUser = async (request, response) => {
	const { email, password, fullName } = request.body;

	const errorCheck = validateSignUp(fullName, email, password);

	if (errorCheck) {
		return response.status(400).json({ error: errorCheck.message });
	}

	//Check if user already exists
	const userExist = await UserModel.findOne({ email: email });

	if (userExist) {
		return response.status(400).json({ error: "Email taken already." });
	}

	//Secure password
	const securePassword = await bcrypt.hash(password, 12);

	//Create user
	const user = await UserModel.create({
		fullName: fullName,
		email: email,
		password: securePassword,
	});

	if (!user) {
		return response.status(400).json({ error: "Something went wrong." });
	}

	//Generate token
	const token = generateToken(user.fullName, user._id);

	return response.status(201).json({
		message: "Sign up successful",
		user: {
			email: user.email,
			fullName: user.fullName,
			imageUrl: user.imageUrl,
		},
		accessToken: token,
	});
};
