import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { useAuth } from "../contexts/AuthContext";

export function useRequireAuth() {
	const { route } = useLocation();
	const { isAuthenticated, loading } = useAuth();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			route("/login", true);
		}
	}, [loading, isAuthenticated, route]);

	return { isAuthenticated, loading };
}
