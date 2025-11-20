import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		author: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		category: {
			type: String,
			required: true,
		},
		coverImage: {
			type: String, // URL to image
			required: true,
		},
		stock: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{ timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
