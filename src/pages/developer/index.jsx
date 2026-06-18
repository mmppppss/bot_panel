import { useState, useEffect } from "preact/hooks";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNotify } from "../../components/Notify/NotifyContext";
import { getAgents, getDeveloperKeys, createDeveloperKey, revokeDeveloperKey, getDeveloperLogs } from "../../services/agents";
import { Table, TableRow } from "../../components/Table";
import { Modal } from "../../components/Modal";

export function Developer() {
	const { loading: authLoading, isAuthenticated } = useRequireAuth();
	const { user } = useAuth();
	const { notify } = useNotify();

	const [agents, setAgents] = useState([]);
	const [selectedAgent, setSelectedAgent] = useState("");
	const [keys, setKeys] = useState([]);
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(false);

	const [showCreateModal, setShowCreateModal] = useState(false);
	const [newKeyName, setNewKeyName] = useState("");
	const [creating, setCreating] = useState(false);
	const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);
	const [revokeTarget, setRevokeTarget] = useState(null);

	useEffect(() => {
		if (!user?.id) return;
		getAgents(user.id)
			.then((res) => setAgents(res.data || []))
			.catch((err) => notify(err.message, "error"));
	}, [user]);

	useEffect(() => {
		if (!selectedAgent) {
			setKeys([]);
			setLogs([]);
			return;
		}
		setLoading(true);
		Promise.all([
			getDeveloperKeys(selectedAgent),
			getDeveloperLogs(selectedAgent),
		])
			.then(([keysRes, logsRes]) => {
				setKeys(keysRes.data || []);
				setLogs(logsRes.data || []);
			})
			.catch((err) => notify(err.message, "error"))
			.finally(() => setLoading(false));
	}, [selectedAgent]);

	const handleCreate = async () => {
		if (!newKeyName.trim()) {
			notify("El nombre es obligatorio", "error");
			return;
		}
		setCreating(true);
		try {
			const res = await createDeveloperKey(selectedAgent, newKeyName.trim());
			setNewlyCreatedKey(res.data);
			setShowCreateModal(false);
			setNewKeyName("");
			getDeveloperKeys(selectedAgent)
				.then((r) => setKeys(r.data || []))
				.catch(() => {});
		} catch (err) {
			notify(err.message, "error");
		} finally {
			setCreating(false);
		}
	};

	const handleRevoke = async () => {
		if (!revokeTarget) return;
		try {
			await revokeDeveloperKey(selectedAgent, revokeTarget.id);
			setKeys((prev) => prev.filter((k) => k.id !== revokeTarget.id));
			setRevokeTarget(null);
			notify("Llave revocada", "success");
		} catch (err) {
			notify(err.message, "error");
		}
	};

	const copyKey = (key) => {
		navigator.clipboard.writeText(key);
		notify("Llave copiada al portapapeles", "success");
	};

	if (authLoading || !isAuthenticated) return null;

	return (
		<div className="min-h-screen flex items-start justify-center px-7 py-8">
			<div className="w-full max-w-5xl">
				<h1 className="text-4xl font-light text-[#2f3e36] text-left mb-2">
					Desarrollador
				</h1>
				<p className="text-sm text-[#2f3e36]/60 mb-8 text-left">
					Administra llaves de API para acceso programático
				</p>

				<div className="mb-6 max-w-xs">
					<label className="text-[#2f3e36] text-sm ml-1 block mb-1.5">Agente</label>
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

				{selectedAgent && (
					<>
						{/* API KEYS */}
						<div className="flex items-center justify-between mb-5">
							<h2 className="text-lg font-medium text-[#2f3e36] text-left">
								Llaves de API
							</h2>
							<button
								onClick={() => { setNewKeyName(""); setShowCreateModal(true); }}
								className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2.5 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#2f3a30] transition-colors"
							>
								+ Crear llave
							</button>
						</div>

						{loading ? (
							<div className="flex items-center justify-center py-16">
								<div className="text-[#2f3e36] text-sm animate-pulse">Cargando...</div>
							</div>
						) : keys.length === 0 ? (
							<div className="text-center py-16 text-[#2f3e36] text-sm">
								Este agente no tiene llaves de API. Haz clic en "+ Crear llave" para generar una.
							</div>
						) : (
							<Table headers={["Nombre", "Prefijo", "Activa", "Último uso", "Creada", ""]} cols={6}>
								{keys.map((k) => (
									<TableRow key={k.id} cols={6} className="grid-cols-[1fr_1fr_0.5fr_1fr_1fr_auto]">
										<span className="text-sm text-[#2f3e36] font-medium">{k.name}</span>
										<span className="text-sm text-[#2f3e36] font-mono">{k.prefix}</span>
										<span className={`text-sm ${k.active ? "text-green-700" : "text-red-600"}`}>
											{k.active ? "Sí" : "No"}
										</span>
										<span className="text-sm text-[#2f3e36]/60">
											{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString("es-MX") : "—"}
										</span>
										<span className="text-sm text-[#2f3e36]/60">
											{new Date(k.createdAt).toLocaleString("es-MX")}
										</span>
										<button
											onClick={() => setRevokeTarget(k)}
											className="text-red-600 hover:text-red-800 transition-colors text-sm ml-auto"
										>
											Revocar
										</button>
									</TableRow>
								))}
							</Table>
						)}

						{/* LOGS */}
						<h2 className="text-lg font-medium text-[#2f3e36] text-left mt-10 mb-5">
							Logs de uso
						</h2>

						{loading ? (
							<div className="flex items-center justify-center py-16">
								<div className="text-[#2f3e36] text-sm animate-pulse">Cargando...</div>
							</div>
						) : logs.length === 0 ? (
							<div className="text-center py-16 text-[#2f3e36] text-sm">
								No hay logs de uso registrados.
							</div>
						) : (
							<div className="max-h-80 overflow-y-auto">
								<Table headers={["Método", "Ruta", "Status", "IP", "Fecha"]} cols={5}>
									{logs.map((l) => (
										<TableRow key={l.id} cols={5} className="grid-cols-[0.5fr_2fr_0.5fr_1fr_1fr]">
											<span className="text-sm text-[#2f3e36] font-mono">{l.method}</span>
											<span className="text-sm text-[#2f3e36]/70 truncate">{l.path}</span>
											<span className={`text-sm ${l.status < 300 ? "text-green-700" : l.status < 500 ? "text-yellow-700" : "text-red-600"}`}>
												{l.status}
											</span>
											<span className="text-sm text-[#2f3e36]/60">{l.ip}</span>
											<span className="text-sm text-[#2f3e36]/60">
												{new Date(l.createdAt).toLocaleString("es-MX")}
											</span>
										</TableRow>
									))}
								</Table>
							</div>
						)}
					</>
				)}
			</div>

			{/* CREATE MODAL */}
			<Modal
				open={showCreateModal}
				title="Nueva llave de API"
				onClose={() => setShowCreateModal(false)}
			>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="text-[#2f3e36] text-xs ml-1">Nombre</label>
						<input
							value={newKeyName}
							onInput={(e) => setNewKeyName(e.target.value)}
							placeholder="ej. Frontend Producción"
							className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-3 text-sm"
							autoFocus
							onKeyDown={(e) => e.key === "Enter" && handleCreate()}
						/>
					</div>
					<div className="flex justify-end gap-3 mt-2">
						<button
							onClick={() => setShowCreateModal(false)}
							className="text-[#2f3e36] px-4 py-2 rounded-full text-sm hover:opacity-70 transition-opacity"
						>
							Cancelar
						</button>
						<button
							onClick={handleCreate}
							disabled={creating}
							className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2 rounded-full text-sm font-bold hover:bg-[#2f3a30] transition-colors disabled:opacity-50"
						>
							{creating ? "Creando..." : "Crear"}
						</button>
					</div>
				</div>
			</Modal>

			{/* KEY REVEAL MODAL */}
			<Modal
				open={!!newlyCreatedKey}
				title="Llave creada"
				onClose={() => setNewlyCreatedKey(null)}
			>
				<div className="flex flex-col gap-4">
					<p className="text-sm text-red-600 font-medium text-left">
						Esta llave solo se muestra una vez. Cópiala ahora. No podrás recuperarla después.
					</p>
					<div className="bg-[#2f3e36] text-[#A18E6E] p-4 rounded-xl font-mono text-xs break-all select-all">
						{newlyCreatedKey?.key}
					</div>
					<div className="flex justify-end gap-3">
						<button
							onClick={() => copyKey(newlyCreatedKey?.key || "")}
							className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2 rounded-full text-sm font-bold hover:bg-[#2f3a30] transition-colors"
						>
							Copiar
						</button>
						<button
							onClick={() => setNewlyCreatedKey(null)}
							className="text-[#2f3e36] px-4 py-2 rounded-full text-sm hover:opacity-70 transition-opacity"
						>
							Cerrar
						</button>
					</div>
				</div>
			</Modal>

			{/* REVOKE CONFIRM */}
			<Modal
				open={!!revokeTarget}
				title="Revocar llave"
				onClose={() => setRevokeTarget(null)}
			>
				<p className="text-sm text-[#2f3e36] mb-6 text-left">
					¿Estás seguro de revocar la llave <strong>"{revokeTarget?.name}"</strong>?
					Una vez revocada dejará de funcionar inmediatamente.
				</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={() => setRevokeTarget(null)}
						className="text-[#2f3e36] px-4 py-2 rounded-full text-sm hover:opacity-70 transition-opacity"
					>
						Cancelar
					</button>
					<button
						onClick={handleRevoke}
						className="bg-red-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-800 transition-colors"
					>
						Revocar
					</button>
				</div>
			</Modal>
		</div>
	);
}
