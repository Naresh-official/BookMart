import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/User.js";
import { Book } from "../models/Book.js";
import { books } from "../utils/seedData.js";

const SEED_USER_PREFIX = "^seed-user-";
const SEED_ADMIN_EMAIL = "seed-admin@bookmart.com";
const SEED_BOOK_PREFIX = "^Seed Book ";

const buildSeedUsers = () =>
	Array.from({ length: 10 }, (_, idx) => ({
		fullName: `Seed User ${idx + 1}`,
		email: `seed-user-${idx + 1}@bookmart.com`,
		password: "Password@123",
		role: "user",
	}));

const seedUsersData = async () => {
	await User.deleteMany({ email: { $regex: SEED_USER_PREFIX } });
	return User.create(buildSeedUsers());
};

const seedBooksData = async () => {
	// Remove old dummy books
	await Book.deleteMany({ title: { $regex: SEED_BOOK_PREFIX } });
	// Remove existing books with the same titles to avoid duplicates
	const titles = books.map((book) => book.title);
	await Book.deleteMany({ title: { $in: titles } });

	return Book.create(books);
};

const seedAdminData = async () => {
	await User.deleteOne({ email: SEED_ADMIN_EMAIL });
	return User.create({
		fullName: "Seed Admin",
		email: SEED_ADMIN_EMAIL,
		password: "Admin@123",
		role: "admin",
	});
};

const seedUsers = asyncHandler(async (req, res) => {
	const users = await seedUsersData();

	return res
		.status(201)
		.json(
			new ApiResponse(
				201,
				{ count: users.length },
				"Seeded 10 users successfully."
			)
		);
});

const seedBooks = asyncHandler(async (req, res) => {
	const books = await seedBooksData();

	return res
		.status(201)
		.json(
			new ApiResponse(
				201,
				{ count: books.length },
				"Seeded 50 books successfully."
			)
		);
});

const seedAdmin = asyncHandler(async (req, res) => {
	const admin = await seedAdminData();

	return res
		.status(201)
		.json(
			new ApiResponse(
				201,
				{ email: admin.email },
				"Seeded admin successfully."
			)
		);
});

const seedAll = asyncHandler(async (req, res) => {
	const users = await seedUsersData();
	const books = await seedBooksData();
	const admin = await seedAdminData();

	return res.status(201).json(
		new ApiResponse(
			201,
			{
				users: users.length,
				books: books.length,
				admin: admin.email,
			},
			"Seeded users, books, and admin successfully."
		)
	);
});

export { seedUsers, seedBooks, seedAdmin, seedAll };
