import { useState, useEffect, useRef } from "preact/hooks";
import { useLocation } from "preact-iso";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNotify } from "../../components/Notify/NotifyContext";
import { getAgents, getAgentConfigs, setAgentConfig, deleteAgentConfig } from "../../services/agents";
import { Table, TableRow } from "../../components/Table";
import { Modal } from "../../components/Modal";

function EditableCell({ value, onSave }) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value);
	const ref = useRef(null);

	useEffect(() => {
		setDraft(value);
	}, [value]);

	const commit = () => {
		setEditing(false);
		if (draft !== value) {
			onSave(draft);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") commit();
		if (e.key === "Escape") {
			setDraft(value);
			setEditing(false);
		}
	};

	if (editing) {
		return (
			<input
				ref={ref}
				value={draft}
				onInput={(e) => setDraft(e.target.value)}
				onBlur={commit}
				onKeyDown={handleKeyDown}
				autoFocus
				className="w-full bg-[#e0e4df] rounded-lg px-2 py-1 text-sm outline-none border border-[#A18E6E]"
			/>
		);
	}

	return (
		<span
			className="text-sm text-[#2f3e36] cursor-pointer hover:bg-[#d9d9d9] rounded px-1 -ml-1 transition-colors min-h-[24px] block"
			onClick={() => setEditing(true)}
		>
			{String(value ?? "") || <span className="text-[#b2b8af] italic">Vacío</span>}
		</span>
	);
}

export function AgentConfig() {
	const { loading: authLoading, isAuthenticated } = useRequireAuth();
	const { user } = useAuth();
	const { route } = useLocation();
	const { notify } = useNotify();

	const [agents, setAgents] = useState([]);
	const [agentsLoading, setAgentsLoading] = useState(true);
	const [selectedAgent, setSelectedAgent] = useState("");
	const [configs, setConfigs] = useState([]);
	const [configsLoading, setConfigsLoading] = useState(false);

	const [showAddModal, setShowAddModal] = useState(false);
	const [newKey, setNewKey] = useState("");
	const [newValue, setNewValue] = useState("");
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
			setConfigs([]);
			return;
		}
		setConfigsLoading(true);
		getAgentConfigs(selectedAgent)
			.then((res) => setConfigs(res.data || []))
			.catch((err) => notify(err.message, "error"))
			.finally(() => setConfigsLoading(false));
	}, [selectedAgent]);

	const handleSetConfig = async (key, value) => {
		try {
			await setAgentConfig(selectedAgent, key, value);
			setConfigs((prev) => {
				const exists = prev.find((c) => c.configKey === key);
				if (exists) {
					return prev.map((c) =>
						c.configKey === key ? { ...c, configValue: value } : c
					);
				}
				return [...prev, { configKey: key, configValue: value }];
			});
		} catch (err) {
			notify(err.message, "error");
		}
	};

	const handleAdd = async () => {
		if (!newKey.trim()) {
			notify("La clave es obligatoria", "error");
			return;
		}
		try {
			await setAgentConfig(selectedAgent, newKey.trim(), newValue);
			setShowAddModal(false);
		} catch (err) {
			notify(err.message, "error");
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		try {
			await deleteAgentConfig(selectedAgent, deleteTarget.configKey);
			setConfigs((prev) => prev.filter((c) => c.configKey !== deleteTarget.configKey));
			setDeleteTarget(null);
			notify("Config eliminada", "success");
		} catch (err) {
			notify(err.message, "error");
		}
	};

	if (authLoading || !isAuthenticated) return null;

	return (
		<div className="min-h-screen flex items-start justify-center px-7 py-8">
			<div className="w-full max-w-3xl">
				<h1 className="text-4xl font-light text-[#2f3e36] text-left mb-2">
					Configuración de agente
				</h1>
				<p className="text-sm text-[#2f3e36]/60 mb-8 text-left">
					Administra las configuraciones clave-valor de cada agente
				</p>

				{/* SELECTOR DE AGENTE */}
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

				{/* CONFIG TABLE */}
				{selectedAgent && (
					<>
						<div className="flex items-center justify-between mb-5">
							<h2 className="text-lg font-medium text-[#2f3e36] text-left">
								Configuraciones
							</h2>
							<button
								onClick={() => { setNewKey(""); setNewValue(""); setShowAddModal(true); }}
								className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2.5 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#2f3a30] transition-colors"
							>
								+ Agregar config
							</button>
						</div>

						{configsLoading ? (
							<div className="flex items-center justify-center py-16">
								<div className="text-[#2f3e36] text-sm animate-pulse">Cargando configuraciones...</div>
							</div>
						) : configs.length === 0 ? (
							<div className="text-center py-16 text-[#2f3e36] text-sm">
								Este agente no tiene configuraciones. Haz clic en "+ Agregar config" para crear una.
							</div>
						) : (
							<Table headers={["Clave", "Valor", ""]} cols={3}>
								{configs.map((c) => (
									<TableRow key={c.configKey} cols={3} className="grid-cols-[1fr_1fr_auto]">
										<span className="text-sm text-[#2f3e36] font-medium">
											{c.configKey}
										</span>
										<EditableCell
											value={c.configValue}
											onSave={(val) => handleSetConfig(c.configKey, val)}
										/>
										<button
											onClick={() => setDeleteTarget(c)}
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
				title="Nueva configuración"
				onClose={() => setShowAddModal(false)}
			>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="text-[#2f3e36] text-xs ml-1">Clave</label>
						<input
							value={newKey}
							onInput={(e) => setNewKey(e.target.value)}
							placeholder="ej. save_messages"
							className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-3 text-sm"
							autoFocus
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-[#2f3e36] text-xs ml-1">Valor</label>
						<input
							value={newValue}
							onInput={(e) => setNewValue(e.target.value)}
							placeholder="ej. true"
							className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-3 text-sm"
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
				title="Eliminar configuración"
				onClose={() => setDeleteTarget(null)}
			>
				<p className="text-sm text-[#2f3e36] mb-6 text-left">
					¿Estás seguro de eliminar la configuración{" "}
					<strong>"{deleteTarget?.configKey}"</strong>?
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
