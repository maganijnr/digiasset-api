import AssetModel from "../models/AssetModel.js";

export const createDigitalAsset = async (request, response) => {
	const { name, description, coverImage, price, categories, images } =
		request.body;
	const { user } = request;

	if (!user) {
		return response.status(400).json({ error: "Not authorized" });
	}

	if (user.role === "USER") {
		return response
			.status(400)
			.json({ error: "Not a creator, can't create an asset." });
	}

	const newAsset = await AssetModel.create({
		name: name,
		description: description,
		coverImage: coverImage,
		price: price,
		categories: categories,
		creator: user._id,
		images: images,
	});

	if (!newAsset) {
		return response.status(400).json({ error: "Can't create asset." });
	}

	return response.status(201).json({
		message: "Asset created successfully",
		asset: newAsset,
	});
};

export const updateDigitalAsset = async (request, response) => {
	const updatedInfo = request.body;

	const { user } = request;
	const { id } = request.params;

	const findAsset = await AssetModel.findById({ _id: id });

	if (!findAsset) {
		return response.status(400).json({ error: "Asset not found" });
	}

	if (!findAsset.creator.equals(user._id)) {
		return response
			.status(400)
			.json({ error: "Not authorized to edit asset" });
	}

	const updatedAsset = await AssetModel.findByIdAndUpdate(
		{ _id: id },
		{ $set: updatedInfo },
		{ new: true }
	);

	if (!updatedAsset) {
		return response.status(400).json({ error: "Can't update asset" });
	}

	return response.status(201).json({
		message: "Asset updated successfully",
		asset: updatedAsset,
	});
};

export const getAllAssets = async (request, response) => {
	const queries = request.query;

	if (Object.keys(queries).length !== 0) {
		const assets = await AssetModel.find({
			name: queries?.search
				? {
						$regex: queries.search,
						$options: "i",
				  }
				: "",
		}).sort({createdAt: -1});

		return response.status(200).json({
			message: "Assets fetched successfully",
			assets: assets,
		});
	} else {
		const assets = await AssetModel.find().sort({createdAt: -1});

		return response.status(200).json({
			message: "Assets fetched successfully",
			assets: assets,
		});
	}
};

export const getAssetById = async (request, response) => {
	const { id } = request.params;

	const asset = await AssetModel.findById({ _id: id });

	if (!asset) {
		return response.status(400).json({ error: "Asset not found" });
	}

	return response.status(200).json({
		message: "Asset fetched successfully",
		asset: asset,
	});
};
