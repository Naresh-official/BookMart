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
			enum: ["processing", "shipped", "delivered", "cancelled"],
			default: "processing",
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		shippingAddress: {
			address: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			postalCode: {
				type: String,
				required: true,
			},
			country: {
				type: String,
				required: true,
			},
		},
	},
	{ timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
