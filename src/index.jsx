import { useEffect } from "preact/hooks";
import { render } from 'preact';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';

import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { Login } from './pages/Login/login.jsx';
import { Register } from './pages/Register/register.jsx';

import { Menu } from './components/menu.jsx';

import { AgentCreator } from './pages/agent-creator/index.jsx';
import { AgentEdit } from './pages/agent-edit/index.jsx';
import { AgentResponses } from './pages/agent-edit/responses/index.jsx';
import { Messages } from './pages/messages/index.jsx';
import { AgentsTable } from './pages/agentsTable/index.jsx';
import { AgentConfig } from './pages/agent-config/index.jsx';
import { Contacts } from './pages/contacts/index.jsx';
import { History } from './pages/history/index.jsx';

import {
	NotifyProvider,
	NotifyContainer
} from './components/Notify/NotifyContext.jsx';

import { AuthProvider } from './contexts/AuthContext.jsx';
import { PageLayout } from './components/Layout.jsx';

import './style.css';

const TITLES = {
	"/": "Dashboard",
	"/login": "Iniciar sesión",
	"/register": "Registro",
	"/create": "Crear agente",
	"/messages": "Mensajes",
	"/agents": "Agentes",
	"/config": "Configuración",
	"/contacts": "Contactos",
	"/history": "Historial",
}

function AppContent() {

	const location = useLocation()

	useEffect(() => {
		const section = TITLES[location.path] || location.path.slice(1)
		document.title = section ? `Reply - ${section}` : "Reply"
	}, [location.path])

	const hideMenu =
		location.path === "/login" ||
		location.path === "/register"

	return (

		<div className="flex">

			{!hideMenu && <Menu />}

			<main className={`flex-1 ${!hideMenu ? "md:ml-20" : ""}`}>

				<Router>

					<Route
						path="/login"
						component={Login}
					/>

					<Route
						path="/register"
						component={Register}
					/>

					<Route
						path="/"
						component={() => <PageLayout><Home /></PageLayout>}
					/>

					<Route
						path="/create"
						component={() => <PageLayout><AgentCreator /></PageLayout>}
					/>

					<Route
						path="/edit/:id"
						component={() => <PageLayout><AgentEdit /></PageLayout>}
					/>

					<Route
						path="/edit/:id/responses"
						component={() => <PageLayout><AgentResponses /></PageLayout>}
					/>

					<Route
						path="/messages"
						component={() => <PageLayout><Messages /></PageLayout>}
					/>

					<Route
						path="/agents"
						component={() => <PageLayout><AgentsTable /></PageLayout>}
					/>

					<Route
						path="/config"
						component={() => <PageLayout><AgentConfig /></PageLayout>}
					/>

					<Route
						path="/contacts"
						component={() => <PageLayout><Contacts /></PageLayout>}
					/>

					<Route
						path="/history"
						component={() => <PageLayout><History /></PageLayout>}
					/>

					<Route
						default
						component={NotFound}
					/>

				</Router>

			</main>

		</div>
	);
}

export function App() {

	return (

		<LocationProvider>

			<AuthProvider>

				<NotifyProvider>

					<NotifyContainer />

					<AppContent />

				</NotifyProvider>

			</AuthProvider>

		</LocationProvider>
	);
}

render(
	<App />,
	document.getElementById('app')
);