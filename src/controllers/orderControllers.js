import Paystack from "../config/paystack.js";
import CartModel from "../models/CartModel.js";
import OrderModel from "../models/OrderModel.js";
import PaymentModel from "../models/PaymentModel.js";
import UserModel from "../models/UserModel.js";

const { initializePayment, verifyPayment } = Paystack();

const createAssetOrder = async (request, response) => {
	const user = request.user;
	const { totalAmount, assets, cartId } = request.body;

	//Initialize the payment for the cart
	const data = {
		amount: Number(totalAmount * 100),
		email: user.email,
		full_name: user.fullName,
	};

	const paymentResponse = await initializePayment(data);

	if (!paymentResponse.status) {
		response.status(400).json({
			error: "Failed to initialize payment",
			message: paymentResponse.message,
		});
	}

	//Create order after initoalizing the payment
	const newOrder = await OrderModel.create({
		assets: assets,
		reference: paymentResponse.data.reference,
		// status: paymentResponse.data.status,
		totalAmount: totalAmount,
		user: user._id,
	});

	if (!newOrder) {
		response.status(400).json({
			error: "Failed to create order",
		});
	}

	//Clear cart
	await CartModel.findByIdAndDelete({ _id: cartId });

	return response.status(201).json({
		message: "Order created successfully",
		data: {
			orderDetails: newOrder,
			paystack_url: paymentResponse.data.authorization_url,
		},
	});
};

const verifyUserOrder = async (request, response) => {
	const { orderId, reference } = request.query;

	if (reference === null || reference === undefined) {
		return response.status(400).json({ error: "No  reference is passed!" });
	}

	const result = await verifyPayment(reference);

	if (result.status) {
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

		const updateOrder = await OrderModel.findByIdAndUpdate(
			{
				_id: orderId,
			},
			{ status: result.data.status },
			{ new: true }
		);

		return response.status(201).json({
			message: "Payment completed successfully",
			data: {
				orderDetails: updateOrder,
			},
		});
	}

	const updateOrder = await OrderModel.findByIdAndUpdate(
		{
			_id: orderId,
		},
		{ status: result.data.status },
		{ new: true }
	);

	return response.status(400).json({
		error: result.message,
		data: {
			orderDetails: updateOrder,
		},
	});
};

const retryUserOrderVerify = async (request, response) => {
	const { orderId, reference } = request.query;

	if (reference === null || reference === undefined) {
		return response.status(400).json({ error: "No  reference is passed!" });
	}

	const findOrder = await OrderModel.findOne({ _id: orderId });

	if (!findOrder) {
		return response.status(400).json({ error: "Order not found" });
	}

	if (findOrder.status === "failed") {
		return response.status(400).json({ error: "Purchase failed" });
	}

	const result = await verifyPayment(reference);

	if (result.status) {
		await PaymentModel.findOne(
			{
				reference: reference,
			},
			{ status: result.data.status },
			{ new: true }
		);

		const updateOrder = await OrderModel.findByIdAndUpdate(
			{
				_id: orderId,
			},
			{ status: result.data.status },
			{ new: true }
		);

		return response.status(201).json({
			message: "Payment completed successfully",
			data: {
				orderDetails: updateOrder,
			},
		});
	}

	const updateOrder = await OrderModel.findOneAndUpdate(
		{
			_id: orderId,
		},
		{ status: result.data.status },
		{ new: true }
	);

	return response.status(400).json({
		error: result.message,
		data: {
			orderDetails: updateOrder,
		},
	});
};

const getAllUserOrders = async (request, response) => {
	const { orderStatus } = request.query;
	const user = request.user;

	if (orderStatus) {
		const orders = await OrderModel.find({
			user: user?._id,
			status: orderStatus,
		});

		return response.status(200).json({
			message: "Orders fetched successfully",
			orders: orders,
		});
	} else {
		const orders = await OrderModel.find({ user: user?._id });

		return response.status(200).json({
			message: "Orders fetched successfully",
			orders: orders,
		});
	}
};

export {
	createAssetOrder,
	verifyUserOrder,
	getAllUserOrders,
	retryUserOrderVerify,
};
