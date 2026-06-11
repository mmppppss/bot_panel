import { useState, useEffect } from "preact/hooks";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNotify } from "../../components/Notify/NotifyContext";
import { getAgents, getResponses, createResponse, deleteResponse, updateResponse } from "../../services/agents";
import { Table, TableRow } from "../../components/Table";
import { Modal } from "../../components/Modal";
import { EditableCell } from "../../components/EditableCell";

export function AutoReplies() {
	const { loading: authLoading, isAuthenticated } = useRequireAuth();
	const { user } = useAuth();
	const { notify } = useNotify();

	const [agents, setAgents] = useState([]);
	const [agentsLoading, setAgentsLoading] = useState(true);
	const [selectedAgent, setSelectedAgent] = useState("");
	const [responses, setResponses] = useState([]);
	const [loading, setLoading] = useState(false);

	const [showAddModal, setShowAddModal] = useState(false);
	const [newKeyword, setNewKeyword] = useState("");
	const [newResponse, setNewResponse] = useState("");
	const [deleteTarget, setDeleteTarget] = useState(null);

	useEffect(() => {
		if (!user?.id) return;
		setAgentsLoading(true);
		getAgents(user.id)
			.then((res) => setAgents(res.data || []))
			.catch((err) => notify(err.message, "error"))
			.finally(() => setAgentsLoading(false));
	}, [user]);

	useEffect(() => {
		if (!selectedAgent) {
			setResponses([]);
			return;
		}
		setLoading(true);
		getResponses(selectedAgent)
			.then((res) => setResponses(res.data || []))
			.catch((err) => notify(err.message, "error"))
			.finally(() => setLoading(false));
	}, [selectedAgent]);

	const handleAdd = async () => {
		if (!newKeyword.trim()) {
			notify("La palabra clave es obligatoria", "error");
			return;
		}
		try {
			const res = await createResponse(selectedAgent, { keyword: newKeyword.trim(), response: newResponse.trim() });
			setResponses((prev) => [...prev, res.data]);
			setShowAddModal(false);
		} catch (err) {
			notify(err.message, "error");
		}
	};

	const handleUpdate = (respId, field, value) => {
		setResponses((prev) =>
			prev.map((r) => (r.id === respId ? { ...r, [field]: value } : r))
		);
		updateResponse(selectedAgent, respId, { [field]: value });
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		try {
			await deleteResponse(selectedAgent, deleteTarget.id);
			setResponses((prev) => prev.filter((r) => r.id !== deleteTarget.id));
			setDeleteTarget(null);
			notify("Regla eliminada", "success");
		} catch (err) {
			notify(err.message, "error");
		}
	};

	if (authLoading || !isAuthenticated) return null;

	return (
		<div className="min-h-screen flex items-start justify-center px-7 py-8">
			<div className="w-full max-w-4xl">
				<h1 className="text-4xl font-light text-[#2f3e36] text-left mb-2">
					Auto-Respuestas
				</h1>
				<p className="text-sm text-[#2f3e36]/60 mb-8 text-left">
					Reglas de palabras clave y respuestas automáticas por agente
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
						<div className="flex items-center justify-between mb-5">
							<h2 className="text-lg font-medium text-[#2f3e36] text-left">
								Reglas ({responses.length})
							</h2>
							<button
								onClick={() => { setNewKeyword(""); setNewResponse(""); setShowAddModal(true); }}
								className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2.5 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#2f3a30] transition-colors"
							>
								+ Agregar regla
							</button>
						</div>

						{loading ? (
							<div className="flex items-center justify-center py-16">
								<div className="text-[#2f3e36] text-sm animate-pulse">Cargando reglas...</div>
							</div>
						) : responses.length === 0 ? (
							<div className="text-center py-16 text-[#2f3e36] text-sm">
								{/* Si el agente no tiene el módulo keyword, sugerir activarlo */}
								{"No hay reglas aún. Haz clic en '+ Agregar regla' para crear una."}
							</div>
						) : (
							<Table headers={["Palabra clave", "Respuesta", ""]} cols={3}>
								{responses.map((r) => (
									<TableRow key={r.id} cols={3} className="grid-cols-[1fr_1fr_auto]">
										<EditableCell
											value={r.keyword || ""}
											onSave={(val) => handleUpdate(r.id, "keyword", val)}
										/>
										<EditableCell
											value={r.response || ""}
											onSave={(val) => handleUpdate(r.id, "response", val)}
										/>
										<button
											onClick={() => setDeleteTarget(r)}
											className="text-red-600 hover:text-red-800 transition-colors text-sm ml-auto"
										>
											Eliminar
										</button>
									</TableRow>
								))}
							</Table>
						)}
					</>
				)}
			</div>

			{/* ADD MODAL */}
			<Modal
				open={showAddModal}
				title="Nueva regla"
				onClose={() => setShowAddModal(false)}
			>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="text-[#2f3e36] text-xs ml-1">Palabra clave</label>
						<input
							value={newKeyword}
							onInput={(e) => setNewKeyword(e.target.value)}
							placeholder="ej. hola"
							className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-3 text-sm"
							autoFocus
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-[#2f3e36] text-xs ml-1">Respuesta</label>
						<textarea
							value={newResponse}
							onInput={(e) => setNewResponse(e.target.value)}
							placeholder="ej. ¡Hola! ¿En qué puedo ayudarte?"
							className="w-full h-20 rounded-xl bg-[#e0e4df] border-none outline-none p-3 text-sm resize-none"
						/>
					</div>
					<div className="flex justify-end gap-3 mt-2">
						<button
							onClick={() => setShowAddModal(false)}
							className="text-[#2f3e36] px-4 py-2 rounded-full text-sm hover:opacity-70 transition-opacity"
						>
							Cancelar
						</button>
						<button
							onClick={handleAdd}
							className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2 rounded-full text-sm font-bold hover:bg-[#2f3a30] transition-colors"
						>
							Agregar
						</button>
					</div>
				</div>
			</Modal>

			{/* DELETE CONFIRM */}
			<Modal
				open={!!deleteTarget}
				title="Eliminar regla"
				onClose={() => setDeleteTarget(null)}
			>
				<p className="text-sm text-[#2f3e36] mb-6 text-left">
					¿Estás seguro de eliminar la regla{" "}
					<strong>"{deleteTarget?.keyword}"</strong>?
				</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={() => setDeleteTarget(null)}
						className="text-[#2f3e36] px-4 py-2 rounded-full text-sm hover:opacity-70 transition-opacity"
					>
						Cancelar
					</button>
					<button
						onClick={handleDeleteConfirm}
						className="bg-red-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-800 transition-colors"
					>
						Eliminar
					</button>
				</div>
			</Modal>
		</div>
	);
}
