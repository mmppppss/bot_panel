import { useLocation } from 'preact-iso';
import { Menu } from '../../components/menu.jsx';


export function Home() {
	const { route } = useLocation()
	const token = localStorage.getItem("token")
	if (!token) {
		route("/login")
		return null
	}

	return (
		<div class="home">
			<Menu />
		</div>
	);
}
