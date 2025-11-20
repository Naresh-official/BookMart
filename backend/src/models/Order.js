import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
	book: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Book",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
	price: {
		type: Number,
		required: true,
	},
});

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: [orderItemSchema],
		totalAmount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: [
				"pending",
				"processing",
				"shipped",
				"delivered",
				"cancelled",
			],
			default: "pending",
		},
		shippingAddress: {
			address: String,
			city: String,
			postalCode: String,
			country: String,
		},
	},
	{ timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
