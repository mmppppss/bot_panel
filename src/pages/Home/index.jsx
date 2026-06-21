import { useState, useEffect } from "preact/hooks";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useAuth } from "../../contexts/AuthContext";
import { getAgents, getMessages, getContacts, getModules } from "../../services/agents";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2f3e36", "#A18E6E", "#3D4A3E", "#b2b8af", "#d9d9d9"];

export function Home() {
	const { loading: authLoading, isAuthenticated } = useRequireAuth();
	const { user } = useAuth();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user?.id) return;
		setLoading(true);
		getAgents(user.id)
			.then(async (res) => {
				const agents = res.data || [];
				const agentDetails = await Promise.all(
					agents.map(async (a) => {
						const [msgRes, conRes, modRes] = await Promise.all([
							getMessages(a.id, 100, 0).catch(() => ({ data: [] })),
							getContacts(a.id).catch(() => ({ data: [] })),
							getModules(user.id, a.id).catch(() => ({ data: [] })),
						]);
						return {
							...a,
							messages: msgRes.data || [],
							contacts: conRes.data || [],
							modules: modRes.data || [],
						};
					})
				);
				setData(agentDetails);
			})
			.catch(() => setData([]))
			.finally(() => setLoading(false));
	}, [user]);

	if (authLoading || !isAuthenticated) return null;

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-[#2f3e36] text-sm animate-pulse">Cargando dashboard...</div>
			</div>
		);
	}

	const agents = data || [];
	const totalContacts = agents.reduce((s, a) => s + a.contacts.length, 0);
	const totalMessages = agents.reduce((s, a) => s + a.messages.length, 0);
	const totalActiveModules = agents.reduce((s, a) => s + a.modules.filter((m) => m.enabled).length, 0);

	const msgsPerAgent = agents.map((a) => ({
		name: a.name,
		mensajes: a.messages.length,
	}));

	const contactPlatforms = {};
	agents.forEach((a) =>
		a.contacts.forEach((c) => {
			contactPlatforms[c.platform] = (contactPlatforms[c.platform] || 0) + 1;
		})
	);
	const platformData = Object.entries(contactPlatforms).map(([name, value]) => ({ name, value }));

	const allMessages = agents
		.flatMap((a) => a.messages.map((m) => ({ ...m, agentName: a.name })))
		.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
		.slice(0, 10);

	const moduleData = agents.map((a) => ({
		name: a.name,
		modules: a.modules.filter((m) => m.enabled).map((m) => m.moduleKey),
	}));

	return (
		<div className="min-h-screen px-7 py-8">
			<h1 className="text-4xl font-light text-[#2f3e36] text-left mb-8">Dashboard</h1>

			{/* SUMMARY CARDS */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				<div className="bg-[#b2b8af] rounded-2xl p-5 text-left">
					<span className="text-3xl font-light text-[#2f3e36] block">{agents.length}</span>
					<span className="text-xs text-[#2f3e36]/60 uppercase tracking-wider">Agentes</span>
				</div>
				<div className="bg-[#b2b8af] rounded-2xl p-5 text-left">
					<span className="text-3xl font-light text-[#2f3e36] block">{totalContacts}</span>
					<span className="text-xs text-[#2f3e36]/60 uppercase tracking-wider">Contactos</span>
				</div>
				<div className="bg-[#b2b8af] rounded-2xl p-5 text-left">
					<span className="text-3xl font-light text-[#2f3e36] block">{totalMessages}</span>
					<span className="text-xs text-[#2f3e36]/60 uppercase tracking-wider">Mensajes</span>
				</div>
				<div className="bg-[#b2b8af] rounded-2xl p-5 text-left">
					<span className="text-3xl font-light text-[#2f3e36] block">{totalActiveModules}</span>
					<span className="text-xs text-[#2f3e36]/60 uppercase tracking-wider">Módulos activos</span>
				</div>
			</div>

			{/* CHARTS ROW */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<div className="bg-[#b2b8af] rounded-2xl p-5">
					<h2 className="text-sm font-medium text-[#2f3e36] uppercase tracking-wider mb-4 text-left">Mensajes por agente</h2>
					{msgsPerAgent.some((d) => d.mensajes > 0) ? (
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={msgsPerAgent}>
								<XAxis dataKey="name" tick={{ fontSize: 11, fill: "#2f3e36" }} />
								<YAxis tick={{ fontSize: 11, fill: "#2f3e36" }} />
								<Tooltip
									contentStyle={{ background: "#DCE1DB", border: "none", borderRadius: 12, fontSize: 12 }}
									labelStyle={{ color: "#2f3e36", fontWeight: 600 }}
								/>
								<Bar dataKey="mensajes" fill="#2f3e36" radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<div className="flex items-center justify-center h-[250px] text-[#2f3e36]/40 text-sm">Sin datos</div>
					)}
				</div>

				<div className="bg-[#b2b8af] rounded-2xl p-5">
					<h2 className="text-sm font-medium text-[#2f3e36] uppercase tracking-wider mb-4 text-left">Contactos por plataforma</h2>
					{platformData.length > 0 ? (
						<ResponsiveContainer width="100%" height={250}>
							<PieChart>
								<Pie
									data={platformData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									innerRadius={40}
									label={({ name, value }) => `${name}: ${value}`}
									labelLine={false}
								>
									{platformData.map((_, i) => (
										<Cell key={i} fill={COLORS[i % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{ background: "#DCE1DB", border: "none", borderRadius: 12, fontSize: 12 }}
								/>
							</PieChart>
						</ResponsiveContainer>
					) : (
						<div className="flex items-center justify-center h-[250px] text-[#2f3e36]/40 text-sm">Sin datos</div>
					)}
				</div>
			</div>

			{/* BOTTOM ROW */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-[#b2b8af] rounded-2xl p-5">
					<h2 className="text-sm font-medium text-[#2f3e36] uppercase tracking-wider mb-4 text-left">Últimos mensajes</h2>
					{allMessages.length > 0 ? (
						<div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto">
							{allMessages.map((m, i) => (
								<div key={i} className="bg-[#DCE1DB] rounded-xl px-4 py-2.5 text-left">
									<div className="flex items-center justify-between gap-2">
										<span className="text-xs font-medium text-[#2f3e36] truncate">{m.agentName}</span>
										<span className="text-[10px] text-[#2f3e36]/40 whitespace-nowrap">
											{m.createdAt ? new Date(m.createdAt).toLocaleString("es-MX") : ""}
										</span>
									</div>
									<p className="text-sm text-[#2f3e36]/70 truncate mt-0.5">{m.content || ""}</p>
									<div className="flex gap-2 mt-1">
										<span className={`text-[10px] uppercase tracking-wider ${m.direction === "incoming" ? "text-green-700" : "text-[#A18E6E]"}`}>
											{m.direction === "incoming" ? "Recibido" : "Enviado"}
										</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex items-center justify-center h-[280px] text-[#2f3e36]/40 text-sm">Sin mensajes</div>
					)}
				</div>

				<div className="bg-[#b2b8af] rounded-2xl p-5">
					<h2 className="text-sm font-medium text-[#2f3e36] uppercase tracking-wider mb-4 text-left">Módulos por agente</h2>
					{moduleData.length > 0 ? (
						<div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto">
							{moduleData.map((a) => (
								<div key={a.name} className="bg-[#DCE1DB] rounded-xl px-4 py-3 text-left flex items-center justify-between">
									<span className="text-sm font-medium text-[#2f3e36]">{a.name}</span>
									<div className="flex gap-1.5">
										{a.modules.length > 0 ? (
											a.modules.map((m) => (
												<span key={m} className="text-[10px] uppercase tracking-wider bg-[#2f3e36] text-[#A18E6E] px-2 py-0.5 rounded-full">
													{m}
												</span>
											))
										) : (
											<span className="text-[10px] text-[#2f3e36]/40">—</span>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex items-center justify-center h-[280px] text-[#2f3e36]/40 text-sm">Sin agentes</div>
					)}
				</div>
			</div>
		</div>
	);
}
