import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const res = await axios.get("/api/books");
				setBooks(res.data.data);
			} catch (error) {
				console.error("Error fetching books:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchBooks();
	}, []);

	return (
		<section className="container space-y-10 py-12">
			<div className="text-center space-y-3">
				<Badge className="mx-auto w-fit rounded-full bg-primary/15 text-primary">
					Spotlight
				</Badge>
				<h1 className="text-4xl font-semibold tracking-tight">
					Featured books picked for you
				</h1>
				<p className="text-muted-foreground">
					Explore staff favorites, trending releases, and hidden gems
					across every genre.
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{loading ? (
					Array.from({ length: 8 }).map((_, index) => (
						<Card key={index} className="space-y-4">
							<Skeleton className="aspect-3/4 w-full rounded-2xl" />
							<CardContent className="space-y-4">
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-10 w-full" />
							</CardContent>
						</Card>
					))
				) : books.length ? (
					books.map((book) => (
						<Card
							key={book._id}
							className="flex flex-col overflow-hidden"
						>
							<div className="relative">
								<img
									src={book.coverImage}
									alt={book.title}
									className="aspect-3/4 w-full object-cover"
								/>
								<Badge className="absolute left-4 top-4 rounded-full bg-background/90 text-foreground">
									₹{Number(book.price ?? 0).toFixed(2)}
								</Badge>
							</div>
							<CardHeader className="space-y-2">
								<CardTitle className="line-clamp-2 text-xl">
									{book.title}
								</CardTitle>
								<CardDescription className="text-base">
									{book.author}
								</CardDescription>
							</CardHeader>
							<CardContent className="mt-auto space-y-3">
								<div className="flex items-center gap-2">
									<Badge
										variant="secondary"
										className="capitalize"
									>
										{book.category || "Uncategorized"}
									</Badge>
									<span className="text-sm text-muted-foreground">
										Stock: {book.stock ?? 0}
									</span>
								</div>
								<Button className="w-full" asChild>
									<Link to={`/book/${book._id}`}>
										View details
									</Link>
								</Button>
							</CardContent>
						</Card>
					))
				) : (
					<Card className="col-span-full text-center">
						<CardContent className="py-12 text-muted-foreground">
							No books available yet. Check back soon.
						</CardContent>
					</Card>
				)}
			</div>
		</section>
	);
};

export default Home;
