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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const emptyForm = {
	title: "",
	author: "",
	description: "",
	price: "",
	category: "",
	coverImage: "",
	stock: "",
};

const statusClasses = {
	processing: {
		border: "border-blue-500",
		bg: "bg-blue-500/10",
	},
	shipped: {
		border: "border-yellow-500",
		bg: "bg-yellow-500/10",
	},
	delivered: {
		border: "border-green-600",
		bg: "bg-green-600/10",
	},
	cancelled: {
		border: "border-red-500",
		bg: "bg-red-500/10",
	},
};

const AdminDashboard = () => {
	const [books, setBooks] = useState([]);
	const [orders, setOrders] = useState([]);
	const [formData, setFormData] = useState(emptyForm);
	const [isEditing, setIsEditing] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");

	useEffect(() => {
		fetchBooks();
		fetchOrders();
	}, []);

	const fetchBooks = async () => {
		const res = await axios.get("/api/books");
		setBooks(res.data.data);
	};

	const fetchOrders = async () => {
		try {
			const res = await axios.get("/api/orders/all-orders");
			setOrders(res.data.data);
		} catch (error) {
			console.error("Error fetching orders:", error);
		}
	};

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			await axios.patch(`/api/orders/${orderId}/status`, {
				status: newStatus,
			});
			fetchOrders();
		} catch (error) {
			console.error("Error updating order status:", error);
			alert("Failed to update order status");
		}
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

	const filteredOrders =
		statusFilter === "all"
			? orders
			: orders.filter((order) => order.status === statusFilter);

	return (
		<section className="container space-y-8 py-12 px-4">
			<div className="space-y-2">
				<h1 className="text-3xl font-semibold">Admin dashboard</h1>
				<p className="text-muted-foreground">
					Manage catalog inventory, orders, and order fulfillment.
				</p>
			</div>

			<Tabs defaultValue="books" className="space-y-6">
				<TabsList>
					<TabsTrigger value="books">Books</TabsTrigger>
					<TabsTrigger value="orders">Orders</TabsTrigger>
				</TabsList>

				<TabsContent value="books">
					<div className="grid gap-8 lg:grid-cols-[340px,1fr]">
						<Card>
							<CardHeader>
								<CardTitle>
									{isEditing ? "Update book" : "Add new book"}
								</CardTitle>
								<CardDescription>
									Provide full metadata so readers can
									discover titles faster.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form
									className="space-y-4"
									onSubmit={handleSubmit}
								>
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
										<Label htmlFor="description">
											Description
										</Label>
										<Textarea
											id="description"
											value={formData.description}
											onChange={(event) =>
												setFormData({
													...formData,
													description:
														event.target.value,
												})
											}
											required
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="price">
												Price (RS)
											</Label>
											<Input
												id="price"
												type="number"
												min="0"
												step="0.01"
												value={formData.price}
												onChange={(event) =>
													setFormData({
														...formData,
														price: event.target
															.value,
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
														stock: event.target
															.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="category">
											Category
										</Label>
										<Input
											id="category"
											value={formData.category}
											onChange={(event) =>
												setFormData({
													...formData,
													category:
														event.target.value,
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
													coverImage:
														event.target.value,
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
									Overview of every book currently in the
									marketplace.
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
													<TableCell>
														{book.author}
													</TableCell>
													<TableCell>
														₹
														{Number(
															book.price ?? 0
														).toFixed(2)}
													</TableCell>
													<TableCell>
														{book.stock}
													</TableCell>
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
																handleDelete(
																	book._id
																)
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
													No books available yet. Add
													your first listing.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="orders">
					<Card className="overflow-hidden">
						<CardHeader>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<CardTitle>Orders</CardTitle>
									<CardDescription>
										Manage all customer orders and update
										their status.
									</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<Label
										htmlFor="status-filter"
										className="text-sm"
									>
										Filter:
									</Label>
									<Select
										value={statusFilter}
										onValueChange={setStatusFilter}
									>
										<SelectTrigger
											id="status-filter"
											className="w-[140px]"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">
												All Orders
											</SelectItem>
											<SelectItem value="processing">
												Processing
											</SelectItem>
											<SelectItem value="shipped">
												Shipped
											</SelectItem>
											<SelectItem value="delivered">
												Delivered
											</SelectItem>
											<SelectItem value="cancelled">
												Cancelled
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{filteredOrders.length ? (
									filteredOrders.map((order) => (
										<Card
											key={order._id}
											className={`border-2 ${
												statusClasses[order.status]
													?.border
											} ${
												statusClasses[order.status]?.bg
											}`}
										>
											<CardContent className="pt-6">
												<div className="space-y-4">
													<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
														<div className="space-y-2">
															<div className="flex items-center gap-2">
																<p className="text-sm font-medium">
																	Order ID:
																</p>
																<code
																	className={`px-4 py-1 rounded-md ${
																		statusClasses[
																			order
																				.status
																		]?.bg
																	} `}
																>
																	{order._id}
																</code>
															</div>
															<div className="flex items-center gap-2">
																<p className="text-sm font-medium">
																	Customer:
																</p>
																<p className="text-sm">
																	{order.user
																		?.fullName ||
																		"N/A"}
																</p>
															</div>
															<div className="flex items-center gap-2">
																<p className="text-sm font-medium">
																	Email:
																</p>
																<p className="text-sm">
																	{order.user
																		?.email ||
																		"N/A"}
																</p>
															</div>
															<div className="flex items-center gap-2">
																<p className="text-sm font-medium">
																	Phone:
																</p>
																<p className="text-sm">
																	{
																		order.phoneNumber
																	}
																</p>
															</div>
															<div className="flex items-start gap-2">
																<p className="text-sm font-medium">
																	Address:
																</p>
																<p className="text-sm">
																	{
																		order
																			.shippingAddress
																			?.address
																	}
																	,{" "}
																	{
																		order
																			.shippingAddress
																			?.city
																	}
																	,{" "}
																	{
																		order
																			.shippingAddress
																			?.postalCode
																	}
																	,{" "}
																	{
																		order
																			.shippingAddress
																			?.country
																	}
																</p>
															</div>
															<div className="flex items-center gap-2">
																<p className="text-sm font-medium">
																	Date:
																</p>
																<p className="text-sm">
																	{new Date(
																		order.createdAt
																	).toLocaleDateString()}
																</p>
															</div>
														</div>
														<div className="flex flex-col gap-3 sm:items-end">
															<div className="flex items-center gap-2">
																<Label
																	htmlFor={`status-${order._id}`}
																	className="text-sm"
																>
																	Status:
																</Label>
																<Select
																	value={
																		order.status
																	}
																	onValueChange={(
																		value
																	) =>
																		handleStatusChange(
																			order._id,
																			value
																		)
																	}
																>
																	<SelectTrigger
																		id={`status-${order._id}`}
																		className="w-[130px]"
																	>
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="processing">
																			Processing
																		</SelectItem>
																		<SelectItem value="shipped">
																			Shipped
																		</SelectItem>
																		<SelectItem value="delivered">
																			Delivered
																		</SelectItem>
																		<SelectItem value="cancelled">
																			Cancelled
																		</SelectItem>
																	</SelectContent>
																</Select>
															</div>
															<p className="text-lg font-semibold">
																₹
																{Number(
																	order.totalAmount
																).toFixed(2)}
															</p>
														</div>
													</div>

													<div className="border-t pt-4">
														<p className="text-sm font-medium mb-3">
															Items:
														</p>
														<div className="space-y-2">
															{order.items?.map(
																(item, idx) => (
																	<div
																		key={
																			idx
																		}
																		className="flex items-center justify-between text-sm"
																	>
																		<div className="flex items-center gap-2">
																			<span className="text-muted-foreground">
																				{
																					item.quantity
																				}

																				x
																			</span>
																			<span>
																				{item
																					.book
																					?.title ||
																					"Unknown Book"}
																			</span>
																		</div>
																		<span className="font-medium">
																			₹
																			{Number(
																				item.price *
																					item.quantity
																			).toFixed(
																				2
																			)}
																		</span>
																	</div>
																)
															)}
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									))
								) : (
									<div className="py-10 text-center text-muted-foreground">
										{statusFilter === "all"
											? "No orders yet."
											: `No ${statusFilter} orders.`}
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</section>
	);
};

export default AdminDashboard;
