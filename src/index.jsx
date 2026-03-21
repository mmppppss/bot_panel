import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { Login } from './pages/Login/login.jsx';
import { Register } from './pages/Register/register.jsx';
import { Menu } from './pages/Menu/Close_menu.jsx';
import { NotifyProvider, NotifyContainer } from './components/Notify/NotifyContext.jsx';
import './style.css';

function AppContent() {
	return (
		<main>
			<Router>
				<Route path="/" component={Home} />
				<Route path="/login" component={Login}/>
				<Route path="/register" component={Register}/>
				<Route path="/menu" component={Menu}/>
				<Route default component={NotFound} />
			</Router>
		</main>
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
