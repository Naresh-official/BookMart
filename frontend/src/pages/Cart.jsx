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

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [submitting, setSubmitting] = useState(false);
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

	const handleCheckout = async () => {
		if (!cartItems.length) return;
		try {
			setSubmitting(true);
			await axios.post("/api/orders", {
				items: cartItems,
				shippingAddress: {
					address: "123 Test St",
					city: "Test City",
					postalCode: "12345",
					country: "Test Country",
				},
			});
			localStorage.removeItem("cart");
			setCartItems([]);
			alert("Order placed successfully!");
			navigate("/books");
		} catch (error) {
			console.error("Checkout failed:", error);
			alert("Checkout failed. Please try again.");
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
							You haven&apos;t added any books yet. Browse the catalog to discover your next
							read.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => navigate("/books")}>Start browsing</Button>
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
											<p className="text-lg font-semibold">{item.title}</p>
											<p className="text-sm text-muted-foreground">
												${Number(item.price ?? 0).toFixed(2)} each
											</p>
										</div>
										<p className="text-lg font-semibold">
											${(Number(item.price ?? 0) * item.quantity).toFixed(2)}
										</p>
									</div>
									<div className="flex flex-wrap items-center gap-3">
										<div className="inline-flex items-center rounded-full border border-border/80">
											<Button
												variant="ghost"
												size="icon"
												type="button"
												onClick={() => updateQuantity(item.book, item.quantity - 1)}
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
												onClick={() => updateQuantity(item.book, item.quantity + 1)}
											>
												+
											</Button>
										</div>
										<Button
											variant="link"
											className="text-destructive"
											type="button"
											onClick={() => removeItem(item.book)}
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
							<CardDescription>Shipping and taxes calculated at checkout.</CardDescription>
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
							<Button
								className="w-full"
								size="lg"
								onClick={handleCheckout}
								disabled={!cartItems.length || submitting}
							>
								{submitting ? "Processing..." : "Proceed to checkout"}
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default Cart;
