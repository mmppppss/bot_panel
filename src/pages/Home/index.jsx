import preactLogo from '../../assets/preact.svg';
import './style.css';

export function Home() {
	const token = localStorage.getItem("token")
	// validar el token
	if(!token){
		window.location.href = "/login"
	}

	return (
		<div class="home">
			holax

		</div>
	);
}

function Resource(props) {
	return (
		<a href={props.href} target="_blank" class="resource">
			<h2>{props.title}</h2>
			<p>{props.description}</p>
		</a>
	);
}
