import { Book } from "../models/Book.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllBooks = asyncHandler(async (req, res) => {
	const { search, category, sort } = req.query;
	let query = {};

	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: "i" } },
			{ author: { $regex: search, $options: "i" } },
		];
	}

	if (category) {
		query.category = category;
	}

	let booksQuery = Book.find(query);

	if (sort) {
		const sortOptions = {
			price_asc: { price: 1 },
			price_desc: { price: -1 },
			newest: { createdAt: -1 },
			popularity: { stock: -1 }, // Placeholder logic
		};
		booksQuery = booksQuery.sort(sortOptions[sort] || { createdAt: -1 });
	}

	const books = await booksQuery;

	return res
		.status(200)
		.json(new ApiResponse(200, books, "Books fetched successfully"));
});

const getBookById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const book = await Book.findById(id);

	if (!book) {
		throw new ApiError(404, "Book not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, book, "Book fetched successfully"));
});

const createBook = asyncHandler(async (req, res) => {
	const { title, author, description, price, category, coverImage, stock } =
		req.body;

	if (
		[title, author, description, category, coverImage].some(
			(field) => field?.trim() === ""
		)
	) {
		throw new ApiError(400, "All fields are required");
	}

	const book = await Book.create({
		title,
		author,
		description,
		price,
		category,
		coverImage,
		stock,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, book, "Book created successfully"));
});

const updateBook = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const book = await Book.findByIdAndUpdate(id, req.body, { new: true });

	if (!book) {
		throw new ApiError(404, "Book not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, book, "Book updated successfully"));
});

const deleteBook = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const book = await Book.findByIdAndDelete(id);

	if (!book) {
		throw new ApiError(404, "Book not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Book deleted successfully"));
});

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
