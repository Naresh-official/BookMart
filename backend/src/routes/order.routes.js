import { Router } from "express";
import {
	createOrder,
	getMyOrders,
	getAllOrders,
	updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);

// Admin only routes
router.get("/all-orders", verifyAdmin, getAllOrders);
router.patch("/:id/status", verifyAdmin, updateOrderStatus);

export default router;
