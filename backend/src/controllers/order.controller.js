import { Order } from "../models/Order.js";
import { Book } from "../models/Book.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
	const { items, shippingAddress } = req.body;

	if (!items || items.length === 0) {
		throw new ApiError(400, "No items in order");
	}

	let totalAmount = 0;
	const orderItems = [];

	// Validate items and calculate total
	for (const item of items) {
		const book = await Book.findById(item.book);
		if (!book) {
			throw new ApiError(404, `Book with id ${item.book} not found`);
		}
		if (book.stock < item.quantity) {
			throw new ApiError(
				400,
				`Insufficient stock for book ${book.title}`
			);
		}

		// Update stock
		book.stock -= item.quantity;
		await book.save();

		orderItems.push({
			book: book._id,
			quantity: item.quantity,
			price: book.price,
		});
		totalAmount += book.price * item.quantity;
	}

	const order = await Order.create({
		user: req.user._id,
		items: orderItems,
		totalAmount,
		shippingAddress,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, order, "Order placed successfully"));
});

const getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id })
		.populate("items.book")
		.sort({ createdAt: -1 });
	return res
		.status(200)
		.json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find()
		.populate("user", "fullName email")
		.populate("items.book")
		.sort({ createdAt: -1 });
	return res
		.status(200)
		.json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

	if (!order) {
		throw new ApiError(404, "Order not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, order, "Order status updated successfully"));
});

export { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
