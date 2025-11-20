import { Router } from "express";
import {
	getAllBooks,
	getBookById,
	createBook,
	updateBook,
	deleteBook,
} from "../controllers/book.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Admin only routes
router.post("/", verifyJWT, verifyAdmin, createBook);
router.put("/:id", verifyJWT, verifyAdmin, updateBook);
router.delete("/:id", verifyJWT, verifyAdmin, deleteBook);

export default router;
