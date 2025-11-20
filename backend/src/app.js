import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedURL = [process.env.FRONTEND_URL, "http://10.169.189.210:5173"];
app.use(
	cors({
		origin: allowedURL,
		credentials: true,
	})
);
app.use(cookieParser());

app.get("/api/health", (req, res) => {
	res.status(200).json({ status: "OK", message: "Server is healthy" });
});

import authRouter from "./routes/auth.routes.js";
import bookRouter from "./routes/book.routes.js";
import orderRouter from "./routes/order.routes.js";
import seedRouter from "./routes/seed.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/orders", orderRouter);
app.use("/api/seed", seedRouter);

app.use(errorHandler);

export default app;
