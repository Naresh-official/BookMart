import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [showCheckoutForm, setShowCheckoutForm] = useState(false);
	const [formData, setFormData] = useState({
		phoneNumber: "",
		address: "",
		city: "",
		postalCode: "",
		country: "",
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		const items = JSON.parse(localStorage.getItem("cart") || "[]");
		setCartItems(items);
	}, []);

	const updateQuantity = (bookId, newQuantity) => {
		if (newQuantity < 1) return;
		const updated = cartItems.map((item) =>
			item.book === bookId ? { ...item, quantity: newQuantity } : item
		);
		setCartItems(updated);
		localStorage.setItem("cart", JSON.stringify(updated));
	};

	const removeItem = (bookId) => {
		const updated = cartItems.filter((item) => item.book !== bookId);
		setCartItems(updated);
		localStorage.setItem("cart", JSON.stringify(updated));
	};

	const total = cartItems.reduce(
		(sum, item) => sum + Number(item.price ?? 0) * item.quantity,
		0
	);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.phoneNumber.trim()) {
			newErrors.phoneNumber = "Phone number is required";
		} else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
			newErrors.phoneNumber = "Please enter a valid phone number";
		}
		if (!formData.address.trim()) {
			newErrors.address = "Address is required";
		}
		if (!formData.city.trim()) {
			newErrors.city = "City is required";
		}
		if (!formData.postalCode.trim()) {
			newErrors.postalCode = "Postal code is required";
		}
		if (!formData.country.trim()) {
			newErrors.country = "Country is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleCheckout = async () => {
		if (!cartItems.length) return;

		if (!validateForm()) {
			return;
		}

		try {
			setSubmitting(true);
			await axios.post("/api/orders", {
				items: cartItems,
				phoneNumber: formData.phoneNumber,
				shippingAddress: {
					address: formData.address,
					city: formData.city,
					postalCode: formData.postalCode,
					country: formData.country,
				},
			});
			localStorage.removeItem("cart");
			setCartItems([]);
			setFormData({
				phoneNumber: "",
				address: "",
				city: "",
				postalCode: "",
				country: "",
			});
			setShowCheckoutForm(false);
			alert("Order placed successfully!");
			navigate("/books");
		} catch (error) {
			console.error("Checkout failed:", error);
			alert(
				error.response?.data?.message ||
					"Checkout failed. Please try again."
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (cartItems.length === 0) {
		return (
			<section className="container py-16">
				<Card className="mx-auto max-w-xl text-center">
					<CardHeader className="space-y-2">
						<CardTitle>Your cart is empty</CardTitle>
						<CardDescription>
							You haven&apos;t added any books yet. Browse the
							catalog to discover your next read.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => navigate("/books")}>
							Start browsing
						</Button>
					</CardContent>
				</Card>
			</section>
		);
	}

	return (
		<section className="container py-12">
			<div className="flex flex-col gap-8 lg:flex-row">
				<div className="flex-1 space-y-4">
					{cartItems.map((item) => (
						<Card key={item.book}>
							<CardContent className="flex flex-col gap-4 pt-6 sm:flex-row">
								<img
									src={item.coverImage}
									alt={item.title}
									className="h-40 w-32 rounded-2xl object-cover sm:h-32 sm:w-24"
								/>
								<div className="flex flex-1 flex-col gap-3">
									<div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
										<div>
											<p className="text-lg font-semibold">
												{item.title}
											</p>
											<p className="text-sm text-muted-foreground">
												$
												{Number(
													item.price ?? 0
												).toFixed(2)}{" "}
												each
											</p>
										</div>
										<p className="text-lg font-semibold">
											$
											{(
												Number(item.price ?? 0) *
												item.quantity
											).toFixed(2)}
										</p>
									</div>
									<div className="flex flex-wrap items-center gap-3">
										<div className="inline-flex items-center rounded-full border border-border/80">
											<Button
												variant="ghost"
												size="icon"
												type="button"
												onClick={() =>
													updateQuantity(
														item.book,
														item.quantity - 1
													)
												}
											>
												-
											</Button>
											<span className="min-w-10 text-center text-sm font-medium">
												{item.quantity}
											</span>
											<Button
												variant="ghost"
												size="icon"
												type="button"
												onClick={() =>
													updateQuantity(
														item.book,
														item.quantity + 1
													)
												}
											>
												+
											</Button>
										</div>
										<Button
											variant="link"
											className="text-destructive"
											type="button"
											onClick={() =>
												removeItem(item.book)
											}
										>
											Remove
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
				<div className="w-full max-w-sm">
					<Card className="sticky top-28">
						<CardHeader>
							<CardTitle>Order summary</CardTitle>
							<CardDescription>
								Shipping and taxes calculated at checkout.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between text-base">
								<span>Subtotal</span>
								<span>${total.toFixed(2)}</span>
							</div>
							<div className="flex items-center justify-between text-lg font-semibold">
								<span>Total</span>
								<span>${total.toFixed(2)}</span>
							</div>

							{!showCheckoutForm ? (
								<Button
									className="w-full"
									size="lg"
									onClick={() => setShowCheckoutForm(true)}
									disabled={!cartItems.length}
								>
									Proceed to checkout
								</Button>
							) : (
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="phoneNumber">
											Phone Number *
										</Label>
										<Input
											id="phoneNumber"
											name="phoneNumber"
											type="tel"
											placeholder="+1 234 567 8900"
											value={formData.phoneNumber}
											onChange={handleInputChange}
											className={
												errors.phoneNumber
													? "border-red-500"
													: ""
											}
										/>
										{errors.phoneNumber && (
											<p className="text-sm text-red-500">
												{errors.phoneNumber}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="address">
											Address *
										</Label>
										<Textarea
											id="address"
											name="address"
											placeholder="Street address"
											value={formData.address}
											onChange={handleInputChange}
											className={
												errors.address
													? "border-red-500"
													: ""
											}
											rows={2}
										/>
										{errors.address && (
											<p className="text-sm text-red-500">
												{errors.address}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="city">City *</Label>
										<Input
											id="city"
											name="city"
											placeholder="City"
											value={formData.city}
											onChange={handleInputChange}
											className={
												errors.city
													? "border-red-500"
													: ""
											}
										/>
										{errors.city && (
											<p className="text-sm text-red-500">
												{errors.city}
											</p>
										)}
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div className="space-y-2">
											<Label htmlFor="postalCode">
												Postal Code *
											</Label>
											<Input
												id="postalCode"
												name="postalCode"
												placeholder="12345"
												value={formData.postalCode}
												onChange={handleInputChange}
												className={
													errors.postalCode
														? "border-red-500"
														: ""
												}
											/>
											{errors.postalCode && (
												<p className="text-sm text-red-500">
													{errors.postalCode}
												</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="country">
												Country *
											</Label>
											<Input
												id="country"
												name="country"
												placeholder="Country"
												value={formData.country}
												onChange={handleInputChange}
												className={
													errors.country
														? "border-red-500"
														: ""
												}
											/>
											{errors.country && (
												<p className="text-sm text-red-500">
													{errors.country}
												</p>
											)}
										</div>
									</div>

									<div className="flex gap-2">
										<Button
											variant="outline"
											className="flex-1"
											onClick={() => {
												setShowCheckoutForm(false);
												setErrors({});
											}}
											disabled={submitting}
										>
											Cancel
										</Button>
										<Button
											className="flex-1"
											onClick={handleCheckout}
											disabled={submitting}
										>
											{submitting
												? "Processing..."
												: "Place Order"}
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default Cart;
