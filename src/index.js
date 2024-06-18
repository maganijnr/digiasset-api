import express from "express";
import connectDB from "./dbConfig.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";

//Routes
import authRoutes from "./routes/authRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
	fileUpload({
		limits: { fileSize: 50 * 1024 * 1024 },
	})
);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 8000;

app.use("/api", authRoutes);
app.use("/api", assetRoutes);
app.use("/api", profileRoutes);
app.use("/api", cartRoutes);
app.use("/api/payment", paymentRoutes);

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "DigiAssets Api",
			version: "1.0.0",
			description: "DigiAssets API",
		},
		servers: [
			{
				url: "http://localhost:8000/api",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const spacs = swaggerjsdoc(options);

app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Listening on post ${PORT}`);
		});
	} catch (error) {
		console.error(error);
	}
};

startServer();
