import { Router } from "express";
import {
	seedAdmin,
	seedAll,
	seedBooks,
	seedUsers,
} from "../controllers/seed.controller.js";

const router = Router();

router.post("/users", seedUsers);
router.post("/books", seedBooks);
router.post("/admin", seedAdmin);
router.post("/all", seedAll);

export default router;
