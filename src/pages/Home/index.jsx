import { useLocation } from 'preact-iso';
import { Menu } from '../Menu/Close_menu.jsx';
import './style.css';

export function Home() {
    const { route } = useLocation()
	const token = localStorage.getItem("token")
	if(!token){
		route("/login")
		return null
	}

	return (
		<div class="home">
			<Menu />
		</div>
	);
}
