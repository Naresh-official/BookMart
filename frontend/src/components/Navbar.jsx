import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
	const { user, logout } = useAuth();
	const navLinkClass = ({ isActive }) =>
		`text-sm font-medium transition-colors ${
			isActive
				? "text-foreground"
				: "text-muted-foreground hover:text-foreground"
		}`;

	return (
		<nav className="sticky px-4 py-2 top-0 z-40 border-b bg-background/80 backdrop-blur">
			<div className="container flex h-16 items-center justify-between gap-6">
				<Link
					to="/"
					className="mr-6 flex items-center gap-2 text-lg font-semibold"
				>
					<span className="inline-flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
						<BookOpen className="size-4" />
					</span>
					<span>BookMart</span>
				</Link>

				<div className="hidden items-center gap-5 md:flex">
					<NavLink to="/books" className={navLinkClass}>
						Browse
					</NavLink>
					<NavLink to="/cart" className={navLinkClass}>
						Cart
					</NavLink>
					{user?.role === "admin" && (
						<NavLink to="/admin" className={navLinkClass}>
							Admin
						</NavLink>
					)}
				</div>

				<div className="flex items-center gap-2">
					{user ? (
						<>
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								asChild
							>
								<Link to="/cart">
									<ShoppingCart className="size-4" />
								</Link>
							</Button>
							<div className="flex items-center gap-2 text-right text-xs text-muted-foreground md:flex">
								<span className="text-sm font-semibold text-primary border-primary border-2 px-4 py-1 rounded-full">
									{user.fullName}
								</span>
								<span className="capitalize bg-secondary px-4 py-1 rounded-full max-w-20">
									{user.role}
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={logout}
							>
								<LogOut className="size-4" />
							</Button>
						</>
					) : (
						<>
							<Button variant="ghost" asChild>
								<Link to="/login">Login</Link>
							</Button>
							<Button asChild>
								<Link to="/register">Create account</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
