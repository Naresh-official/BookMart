import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
import { useAuth } from "../context/AuthContext";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const BookDetails = () => {
	const { id } = useParams();
	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchBook = async () => {
			try {
				const res = await axios.get(`/api/books/${id}`);
				setBook(res.data.data);
			} catch (error) {
				console.error("Error fetching book:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchBook();
	}, [id]);

	const addToCart = () => {
		if (!user) {
			navigate("/login");
			return;
		}

		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const existingItem = cart.find((item) => item.book === book._id);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			cart.push({
				book: book._id,
				quantity: 1,
				title: book.title,
				price: book.price,
				coverImage: book.coverImage,
			});
		}

		localStorage.setItem("cart", JSON.stringify(cart));
		alert("Added to cart!");
	};

	if (loading) {
		return (
			<section className="container grid gap-8 py-12 md:grid-cols-2">
				<Skeleton className="aspect-3/4 rounded-3xl" />
				<div className="space-y-6">
					<Skeleton className="h-9 w-3/4" />
					<Skeleton className="h-6 w-1/2" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-12 w-1/2" />
				</div>
			</section>
		);
	}

	if (!book) {
		return (
			<section className="container py-12 px-4 text-center">
				<Card className="mx-auto max-w-lg">
					<CardHeader>
						<CardTitle>Book not found</CardTitle>
						<CardDescription>
							The book you&apos;re looking for has been archived.
						</CardDescription>
					</CardHeader>
				</Card>
			</section>
		);
	}

	return (
		<section className="container grid gap-10 py-12 px-4 md:grid-cols-[1.1fr_0.9fr]">
			<Card className="overflow-hidden">
				<img
					src={book.coverImage}
					alt={book.title}
					className="aspect-3/4 w-full object-cover"
				/>
			</Card>
			<Card>
				<CardHeader className="space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<Badge className="rounded-full bg-primary/10 text-primary capitalize">
							{book.category || "Uncategorized"}
						</Badge>
						<span className="text-sm text-muted-foreground">
							Stock: {book.stock ?? 0} copies
						</span>
					</div>
					<CardTitle className="text-4xl">{book.title}</CardTitle>
					<CardDescription className="text-lg">
						by{" "}
						<span className="font-medium text-foreground">
							{book.author}
						</span>
					</CardDescription>
					<p className="text-3xl font-semibold tracking-tight">
						₹{Number(book.price ?? 0).toFixed(2)}
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-base leading-relaxed text-muted-foreground">
						{book.description}
					</p>
					<Button
						className="w-full"
						size="lg"
						onClick={addToCart}
						disabled={book.stock === 0}
					>
						{book.stock > 0 ? "Add to cart" : "Out of stock"}
					</Button>
					<div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
						<p>
							Ships within 2-4 business days from partner
							warehouses.
						</p>
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

export default BookDetails;
