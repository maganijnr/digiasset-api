import CartModel from "../models/CartModel.js";

export const addItemToCart = async (request, response) => {
	const { user } = request;
	const { assetId } = request.body;

	const userCartExist = await CartModel.findOne({
		creator: user._id,
	}).populate("cartItems");

	if (!userCartExist) {
		const newCart = new CartModel({
			cartItems: [assetId],
			creator: user._id,
		});

		await newCart.save();

		return response.status(200).json({
			message: "Asset added successfully",
			cart: newCart,
		});
	}
	if (userCartExist) {
		const itemExistInCart = userCartExist?.cartItems.find(
			(item) => item._id.toString() === assetId
		);

		if (itemExistInCart) {
			return response.status(400).json({ error: "Asset already in cart" });
		}

		const updatedCart = await CartModel.findOneAndUpdate(
			{ creator: user._id },
			{ $push: { cartItems: assetId } },
			{ new: true }
		);

		return response.status(200).json({
			message: "Asset added successfully",
			cart: updatedCart,
		});
	}
};

export const getUserCartItems = async (req, res) => {
	const { user } = req;
	const cart = await CartModel.findOne({ creator: user._id }).populate(
		"cartItems"
	);

	if (!cart) {
		return res
			.status(400)
			.json({ error: "Cart is empty", userCart: null, cartTotal: 0 });
	}

	let cartTotal = 0;

	if (cart.cartItems.length !== 0) {
		cartTotal = cart.cartItems.reduce((acc, curr) => {
			return acc + curr.price;
		}, 0);
	}

	return res.status(200).json({
		message: "Cart fetched successfully",
		userCart: cart,
		cartTotal: cartTotal,
	});
};

export const deleteCartItem = async (req, res) => {
	const { user } = req;
	const { assetId } = req.body;

	const cart = await CartModel.findOne({ creator: user._id });

	if (!cart) {
		return res.status(400).json({ error: "Cart is empty" });
	}

	const updatedCart = await CartModel.findOneAndUpdate(
		{ creator: user._id },
		{ $pull: { cartItems: assetId } },
		{ new: true }
	);

	if (updatedCart.cartItems.length === 0) {
		await CartModel.findByIdAndDelete({ _id: updatedCart._id });
	}

	res.status(200).json({
		message: "Cart item deleted successfully",
	});
};
