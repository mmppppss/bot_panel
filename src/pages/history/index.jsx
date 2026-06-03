import { useState, useEffect } from "preact/hooks";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNotify } from "../../components/Notify/NotifyContext";
import { getAgents, getMessages } from "../../services/agents";
import { Table, TableRow } from "../../components/Table";
import { LuArrowDownLeft, LuArrowUpRight } from "react-icons/lu";

const LIMIT = 20;

function formatDate(dateStr) {
	if (!dateStr) return "—";
	return new Date(dateStr).toLocaleString("es-MX", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function truncate(text, max = 60) {
	if (!text) return "—";
	return text.length > max ? text.slice(0, max) + "..." : text;
}

export function History() {
	const { loading: authLoading, isAuthenticated } = useRequireAuth();
	const { user } = useAuth();
	const { notify } = useNotify();

	const [agents, setAgents] = useState([]);
	const [agentsLoading, setAgentsLoading] = useState(true);
	const [selectedAgent, setSelectedAgent] = useState("");
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		if (!user?.id) return;
		setAgentsLoading(true);
		getAgents(user.id)
			.then((res) => setAgents(res.data || []))
			.catch((err) => notify(err.message, "error"))
			.finally(() => setAgentsLoading(false));
	}, [user]);

	const fetchMessages = (newOffset) => {
		if (!selectedAgent) return;
		setLoading(true);
		getMessages(selectedAgent, LIMIT, newOffset)
			.then((res) => {
				const data = res.data || [];
				setMessages(data);
				setHasMore(data.length >= LIMIT);
			})
			.catch((err) => notify(err.message, "error"))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		setOffset(0);
		if (selectedAgent) fetchMessages(0);
		else setMessages([]);
	}, [selectedAgent]);

	const goPrev = () => {
		const newOffset = Math.max(0, offset - LIMIT);
		setOffset(newOffset);
		fetchMessages(newOffset);
	};

	const goNext = () => {
		const newOffset = offset + LIMIT;
		setOffset(newOffset);
		fetchMessages(newOffset);
	};

	if (authLoading || !isAuthenticated) return null;

	return (
		<div className="min-h-screen flex items-start justify-center px-7 py-8">
			<div className="w-full max-w-6xl">
				<h1 className="text-4xl font-light text-[#2f3e36] text-left mb-2">
					Historial de mensajes
				</h1>
				<p className="text-sm text-[#2f3e36]/60 mb-8 text-left">
					Registro de mensajes entrantes y salientes por agente
				</p>

				{agentsLoading ? (
					<div className="flex items-center justify-center py-10">
						<div className="text-[#2f3e36] text-sm animate-pulse">Cargando agentes...</div>
					</div>
				) : (
					<div className="flex flex-col gap-1.5 mb-8 max-w-xs">
						<label className="text-[#2f3e36] text-sm ml-1">Selecciona un agente</label>
						<select
							value={selectedAgent}
							onChange={(e) => setSelectedAgent(e.target.value)}
							className="w-full h-11 rounded-xl bg-[#e0e4df] border-none outline-none px-4 text-sm"
						>
							<option value="">-- Seleccionar --</option>
							{agents.map((a) => (
								<option key={a.id} value={a.id}>{a.name}</option>
							))}
						</select>
					</div>
				)}

				{selectedAgent && (
					<>
						{loading ? (
							<div className="flex items-center justify-center py-20">
								<div className="text-[#2f3e36] text-sm animate-pulse">Cargando mensajes...</div>
							</div>
						) : messages.length === 0 ? (
							<div className="text-center py-20 text-[#2f3e36] text-sm">
								No hay mensajes registrados para este agente.
							</div>
						) : (
							<>
								<Table headers={["", "Contacto", "Chat", "Contenido", "Módulo", "Fecha"]} cols={6}>
									{messages.map((m) => (
										<TableRow key={m.id} cols={6} className="grid-cols-[40px_1fr_1fr_1.5fr_1fr_1fr]">
											<span className="flex items-center justify-center">
												{m.direction === "incoming" ? (
													<LuArrowDownLeft className="w-4 h-4 text-green-600" />
												) : (
													<LuArrowUpRight className="w-4 h-4 text-[#A18E6E]" />
												)}
											</span>
											<span className="text-sm text-[#2f3e36]">
												{m.direction === "incoming" ? m.from : m.to}
											</span>
											<span className="text-sm text-[#2f3e36]">{m.chat}</span>
											<span className="text-sm text-[#2f3e36] truncate" title={m.content}>
												{truncate(m.content)}
											</span>
											<span className="text-sm text-[#2f3e36]/60">{m.moduleKey || "—"}</span>
											<span className="text-sm text-[#2f3e36]/60">{formatDate(m.createdAt)}</span>
										</TableRow>
									))}
								</Table>

								{/* PAGINACIÓN */}
								<div className="flex items-center justify-center gap-4 mt-6">
									<button
										onClick={goPrev}
										disabled={offset === 0}
										className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#2f3a30] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
									>
										Anterior
									</button>
									<span className="text-sm text-[#2f3e36]/60">
										{offset + 1}–{offset + messages.length}
									</span>
									<button
										onClick={goNext}
										disabled={!hasMore}
										className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#2f3a30] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
									>
										Siguiente
									</button>
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
