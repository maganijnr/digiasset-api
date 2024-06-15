import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const generateToken = (name, userId) => {
	const token = jwt.sign({ name: name, userId: userId }, process.env.JWT_KEY, {
		expiresIn: "365d",
	});

	return token;
};

const verifyToken = async (request, response, next) => {
	const token =
		request.headers.authorization &&
		request.headers.authorization.startsWith("Bearer")
			? request.headers.authorization.split(" ")[1]
			: "";

	if (token) {
		const decoded = jwt.verify(token, process.env.JWT_KEY);

		const { userId } = decoded;

		const getUser = await UserModel.findById({ _id: userId }).select(
			"-password"
		);

		if (!getUser) {
			return response.status(400).json({ error: "Not authorized" });
		}

		request.user = getUser;
	} else {
		return response.status(400).json({ error: "Not authorized, sign up" });
	}

	next();
};

export { generateToken, verifyToken };
