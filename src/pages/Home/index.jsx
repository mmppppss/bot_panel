import { useRequireAuth } from "../../hooks/useRequireAuth";

export function Home() {
	const { isAuthenticated } = useRequireAuth();

	if (!isAuthenticated) return null;

	return (
		<div class="home">
			<h1 className="text-4xl font-light text-[#2f3e36]">Dashboard</h1>
		</div>
	);
}
