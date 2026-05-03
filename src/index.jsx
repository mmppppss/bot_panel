import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { Login } from './pages/Login/login.jsx';
import { Register } from './pages/Register/register.jsx';
import { Menu } from './components/menu.jsx';
import { WhabotConfig } from './pages/Replyconfig/replyconfig';
import { NotifyProvider, NotifyContainer } from './components/Notify/NotifyContext.jsx';
import './style.css';

function AppContent() {
	return (
		// Usamos flex para que el Menu esté a la izquierda y el Router a la derecha
		<div className="flex">
			{/* El Menu se coloca AQUÍ para que sea visible en todas las páginas */}
			<Menu />

			{/* El main contendrá las páginas que cambian */}
			<main className="flex-1">
				<Router>
					<Route path="/" component={Home} />
					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
					<Route path="/reply" component={WhabotConfig} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</div>
	);
}

export function App() {
	return (
		<LocationProvider>
			<NotifyProvider>
				<NotifyContainer />
				<AppContent />
			</NotifyProvider>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));