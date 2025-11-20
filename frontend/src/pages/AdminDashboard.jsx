import { useEffect, useState } from "react";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const emptyForm = {
	title: "",
	author: "",
	description: "",
	price: "",
	category: "",
	coverImage: "",
	stock: "",
};

const AdminDashboard = () => {
	const [books, setBooks] = useState([]);
	const [formData, setFormData] = useState(emptyForm);
	const [isEditing, setIsEditing] = useState(null);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		fetchBooks();
	}, []);

	const fetchBooks = async () => {
		const res = await axios.get("/api/books");
		setBooks(res.data.data);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSaving(true);
		try {
			if (isEditing) {
				await axios.put(`/api/books/${isEditing}`, formData);
			} else {
				await axios.post("/api/books", formData);
			}
			setFormData(emptyForm);
			setIsEditing(null);
			fetchBooks();
		} catch (error) {
			console.error("Error saving book:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Remove this book?")) return;
		await axios.delete(`/api/books/${id}`);
		fetchBooks();
	};

	const handleEdit = (book) => {
		setFormData({
			title: book.title ?? "",
			author: book.author ?? "",
			description: book.description ?? "",
			price: book.price?.toString() ?? "",
			category: book.category ?? "",
			coverImage: book.coverImage ?? "",
			stock: book.stock?.toString() ?? "",
		});
		setIsEditing(book._id);
	};

	const handleCancel = () => {
		setIsEditing(null);
		setFormData(emptyForm);
	};

	return (
		<section className="container space-y-8 py-12 px-4">
			<div className="space-y-2">
				<h1 className="text-3xl font-semibold">Admin dashboard</h1>
				<p className="text-muted-foreground">
					Manage catalog inventory, pricing, and featured content.
				</p>
			</div>

			<div className="grid gap-8 lg:grid-cols-[340px,1fr]">
				<Card>
					<CardHeader>
						<CardTitle>
							{isEditing ? "Update book" : "Add new book"}
						</CardTitle>
						<CardDescription>
							Provide full metadata so readers can discover titles
							faster.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="space-y-4" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(event) =>
										setFormData({
											...formData,
											title: event.target.value,
										})
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="author">Author</Label>
								<Input
									id="author"
									value={formData.author}
									onChange={(event) =>
										setFormData({
											...formData,
											author: event.target.value,
										})
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									value={formData.description}
									onChange={(event) =>
										setFormData({
											...formData,
											description: event.target.value,
										})
									}
									required
								/>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="price">Price (USD)</Label>
									<Input
										id="price"
										type="number"
										min="0"
										step="0.01"
										value={formData.price}
										onChange={(event) =>
											setFormData({
												...formData,
												price: event.target.value,
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="stock">Stock</Label>
									<Input
										id="stock"
										type="number"
										min="0"
										value={formData.stock}
										onChange={(event) =>
											setFormData({
												...formData,
												stock: event.target.value,
											})
										}
										required
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="category">Category</Label>
								<Input
									id="category"
									value={formData.category}
									onChange={(event) =>
										setFormData({
											...formData,
											category: event.target.value,
										})
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="coverImage">
									Cover image URL
								</Label>
								<Input
									id="coverImage"
									value={formData.coverImage}
									onChange={(event) =>
										setFormData({
											...formData,
											coverImage: event.target.value,
										})
									}
									required
								/>
							</div>

							<div className="flex gap-3">
								<Button
									type="submit"
									className="flex-1"
									disabled={isSaving}
								>
									{isSaving
										? "Saving..."
										: isEditing
										? "Update book"
										: "Add book"}
								</Button>
								{isEditing && (
									<Button
										type="button"
										variant="outline"
										onClick={handleCancel}
									>
										Cancel
									</Button>
								)}
							</div>
						</form>
					</CardContent>
				</Card>

				<Card className="overflow-hidden">
					<CardHeader>
						<CardTitle>Catalog</CardTitle>
						<CardDescription>
							Overview of every book currently in the marketplace.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Author</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Stock</TableHead>
									<TableHead />
								</TableRow>
							</TableHeader>
							<TableBody>
								{books.length ? (
									books.map((book) => (
										<TableRow key={book._id}>
											<TableCell>
												<div className="space-y-1">
													<p className="font-semibold">
														{book.title}
													</p>
													<Badge
														variant="outline"
														className="capitalize"
													>
														{book.category ||
															"Uncategorized"}
													</Badge>
												</div>
											</TableCell>
											<TableCell>{book.author}</TableCell>
											<TableCell>
												₹
												{Number(
													book.price ?? 0
												).toFixed(2)}
											</TableCell>
											<TableCell>{book.stock}</TableCell>
											<TableCell className="space-x-2 text-right">
												<Button
													variant="ghost"
													size="sm"
													type="button"
													onClick={() =>
														handleEdit(book)
													}
												>
													Edit
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="text-destructive"
													type="button"
													onClick={() =>
														handleDelete(book._id)
													}
												>
													Delete
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={5}
											className="py-10 text-center text-muted-foreground"
										>
											No books available yet. Add your
											first listing.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default AdminDashboard;
