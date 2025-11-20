import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import "./App.css";

function App() {
	return (
		<Router>
			<AuthProvider>
				<div className="min-h-screen bg-background font-sans antialiased">
					<Navbar />
					<main>
						<Routes>
							<Route path="/" element={<Landing />} />
							<Route path="/books" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/book/:id" element={<BookDetails />} />
							<Route path="/cart" element={<Cart />} />

							{/* Admin Routes */}
							<Route
								element={<ProtectedRoute adminOnly={true} />}
							>
								<Route
									path="/admin"
									element={<AdminDashboard />}
								/>
							</Route>
						</Routes>
					</main>
				</div>
			</AuthProvider>
		</Router>
	);
}

export default App;
