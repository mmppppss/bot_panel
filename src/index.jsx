import { render } from 'preact';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';

import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { Login } from './pages/Login/login.jsx';
import { Register } from './pages/Register/register.jsx';
import { Menu } from './components/menu.jsx';
import { AgentCreator } from './pages/agent-creator/index.jsx';
import { NotifyProvider, NotifyContainer } from './components/Notify/NotifyContext.jsx';

import './style.css';

function AppContent() {

	const location = useLocation()

	const hideMenu =
		location.url === "/login" ||
		location.url === "/register"

	return (

		<div className="flex">

			{!hideMenu && <Menu />}

			<main className="flex-1">
				<Router>
					<Route path="/" component={Home} />
					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
					<Route path="/create" component={AgentCreator} />
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