import { ApiError } from "./apiError.js";

export const validateRequest = (schema) => (req, res, next) => {
	// Placeholder for validation logic if needed, or can be removed if not used.
	// Currently app.js imports it, so providing a dummy or simple implementation.
	next();
};
