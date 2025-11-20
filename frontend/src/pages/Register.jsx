import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError("");
		try {
			await register(formData.fullName, formData.email, formData.password);
			navigate("/login");
		} catch (err) {
			setError(err.response?.data?.message || "Registration failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="container flex min-h-[80vh] items-center justify-center py-12">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-4 text-center">
					<CardTitle className="text-3xl">Create your account</CardTitle>
					<CardDescription>
						Set up your profile to start buying and selling on BookMart.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="fullName">Full name</Label>
							<Input
								id="fullName"
								type="text"
								autoComplete="name"
								value={formData.fullName}
								onChange={(event) =>
									setFormData({ ...formData, fullName: event.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								autoComplete="email"
								value={formData.email}
								onChange={(event) =>
									setFormData({ ...formData, email: event.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								autoComplete="new-password"
								value={formData.password}
								onChange={(event) =>
									setFormData({ ...formData, password: event.target.value })
								}
								required
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "Creating account..." : "Create account"}
						</Button>
					</form>
					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link to="/login" className="font-medium text-primary">
							Sign in
						</Link>
					</p>
				</CardContent>
			</Card>
		</section>
	);
};

export default Register;
