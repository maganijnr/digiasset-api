import Paystack from "../config/paystack.js";
import PaymentModel from "../models/PaymentModel.js";
import UserModel from "../models/UserModel.js";

const { initializePayment, verifyPayment } = Paystack();

const startAssetPurchase = async (req, res) => {
	const { amount, email, fullName, cartId } = req.body;

	const data = {
		amount: Number(amount * 100),
		email,
		full_name: fullName,
		order_id: cartId,
	};
	const paymentResponse = await initializePayment(data);

	if (paymentResponse.status) {
		return res.status(201).json({
			message: "Initialized successfully",
			data: paymentResponse,
		});
	} else {
		return res
			.status(400)
			.json({ error: paymentResponse.message, data: paymentResponse });
	}
};

const createAssetPurchase = async (request, response) => {
	const { reference } = request.query;

	if (reference === null || reference === undefined) {
		return response.status(400).json({ error: "No  reference is passed!" });
	}

	const result = await verifyPayment(reference);

	if (result.status) {
		console.log(result.data);
		// return response.json({response: result})
		const findUser = await UserModel.findOne({
			email: result.data.customer.email,
		});

		if (!findUser) {
			return response.status(400).json({ error: "User does not exist" });
		}

		const newPayment = {
			email: result.data.customer.email,
			fullName: findUser.fullName,
			amount: result.data.amount / 100,
			reference: result.data.reference,
			status: result.data.status,
		};

		const payment = await PaymentModel.create(newPayment);

		if (!payment) {
			return response.status(400).json({ error: "Something went wrong." });
		}

		return response.status(201).json({
			message: "Payment successful",
			data: payment,
		});
	} else {
		return response.status(400).json({ error: result.message });
	}
};

const paymentReciept = async (req, res) => {
	const { reference } = req.body;

	const transaction = await PaymentModel.findOne({ reference: reference });

	if (!transaction) {
		return res.status(400).json({ error: "Transaction not found" });
	}

	return res.status(200).json({
		message: "Transaction found",
		transaction,
	});
};

export { startAssetPurchase, createAssetPurchase, paymentReciept };
