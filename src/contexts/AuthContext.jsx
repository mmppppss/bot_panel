import { createContext } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const savedToken = localStorage.getItem("token");
		const savedUser = localStorage.getItem("user");
		if (savedToken) {
			setToken(savedToken);
			if (savedUser) {
				setUser(JSON.parse(savedUser));
			}
		}
		setLoading(false);
	}, []);

	const login = (newToken, userData) => {
		const safeUser = {
			id: userData.id,
			email: userData.email,
			username: userData.username || userData.name,
		};
		setToken(newToken);
		setUser(safeUser);
		localStorage.setItem("token", newToken);
		localStorage.setItem("user", JSON.stringify(safeUser));
		localStorage.setItem("id_user", userData.id);
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		localStorage.removeItem("id_user");
	};

	const isAuthenticated = !!token;

	return (
		<AuthContext.Provider value={{ token, user, loading, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
