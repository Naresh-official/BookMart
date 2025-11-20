/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get("/api/auth/me");
				setUser(res.data.data);
			} catch {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		checkAuth();
	}, []);

	const login = async (email, password) => {
		const res = await axios.post("/api/auth/login", { email, password });
		setUser(res.data.data.user);
		return res.data;
	};

	const register = async (fullName, email, password) => {
		const res = await axios.post("/api/auth/register", {
			fullName,
			email,
			password,
		});
		return res.data;
	};

	const logout = async () => {
		await axios.post("/api/auth/logout");
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, login, register, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
