import { useState, useEffect } from "preact/hooks";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNotify } from "../../components/Notify/NotifyContext";
import { getAgents, getContacts, createContact, updateContact, deleteContact } from "../../services/agents";
import { Table, TableRow } from "../../components/Table";
import { Modal } from "../../components/Modal";
import { EditableCell } from "../../components/EditableCell";

const PLATFORMS = ["whatsapp", "telegram"];
const CHAT_TYPES = ["private", "group"];

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

export function Contacts() {
	const { loading: authLoading, isAuthenticated } = useRequireAuth();
	const { user } = useAuth();
	const { notify } = useNotify();

	const [agents, setAgents] = useState([]);
	const [agentsLoading, setAgentsLoading] = useState(true);
	const [selectedAgent, setSelectedAgent] = useState("");
	const [contacts, setContacts] = useState([]);
	const [contactsLoading, setContactsLoading] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [editTarget, setEditTarget] = useState(null);
	const [formData, setFormData] = useState({ contactId: "", name: "", platform: "whatsapp", chatType: "private" });
	const [saving, setSaving] = useState(false);
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
			setContacts([]);
			return;
		}
		setContactsLoading(true);
		getContacts(selectedAgent)
			.then((res) => setContacts(res.data || []))
			.catch((err) => notify(err.message, "error"))
			.finally(() => setContactsLoading(false));
	}, [selectedAgent]);

	const openCreate = () => {
		setEditTarget(null);
		setFormData({ contactId: "", name: "", platform: "whatsapp", chatType: "private" });
		setShowModal(true);
	};

	const openEdit = (contact) => {
		setEditTarget(contact);
		setFormData({
			contactId: contact.contactId || "",
			name: contact.name || "",
			platform: contact.platform || "whatsapp",
			chatType: contact.chatType || "private",
		});
		setShowModal(true);
	};

	const handleSave = async () => {
		if (!formData.contactId.trim()) {
			notify("El ID del contacto es obligatorio", "error");
			return;
		}
		setSaving(true);
		try {
			const payload = {
				contactId: formData.contactId.trim(),
				name: formData.name.trim(),
				platform: formData.platform,
				chatType: formData.chatType,
			};

			if (editTarget) {
				await updateContact(selectedAgent, editTarget.contactId, payload);
				setContacts((prev) =>
					prev.map((c) =>
						c.contactId === editTarget.contactId
							? { ...c, name: payload.name, platform: payload.platform, chatType: payload.chatType }
							: c
					)
				);
				notify("Contacto actualizado", "success");
			} else {
				const res = await createContact(selectedAgent, payload);
				setContacts((prev) => [...prev, res.data]);
				notify("Contacto creado", "success");
			}
			setShowModal(false);
		} catch (err) {
			notify(err.message, "error");
		} finally {
			setSaving(false);
		}
	};

	const handleNameSave = async (contactId, name) => {
		try {
			await updateContact(selectedAgent, contactId, { name });
			setContacts((prev) =>
				prev.map((c) => (c.contactId === contactId ? { ...c, name } : c))
			);
		} catch (err) {
			notify(err.message, "error");
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		try {
			await deleteContact(selectedAgent, deleteTarget.contactId);
			setContacts((prev) => prev.filter((c) => c.contactId !== deleteTarget.contactId));
			setDeleteTarget(null);
			notify("Contacto eliminado", "success");
		} catch (err) {
			notify(err.message, "error");
		}
	};

	if (authLoading || !isAuthenticated) return null;

	return (
		<div className="min-h-screen flex items-start justify-center px-7 py-8">
			<div className="w-full max-w-5xl">
				<h1 className="text-4xl font-light text-[#2f3e36] text-left mb-2">
					Contactos
				</h1>
				<p className="text-sm text-[#2f3e36]/60 mb-8 text-left">
					Directorio de contactos por agente
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
								Contactos ({contacts.length})
							</h2>
							<button
								onClick={openCreate}
								className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2.5 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#2f3a30] transition-colors"
							>
								+ Agregar contacto
							</button>
						</div>

						{contactsLoading ? (
							<div className="flex items-center justify-center py-16">
								<div className="text-[#2f3e36] text-sm animate-pulse">Cargando contactos...</div>
							</div>
						) : contacts.length === 0 ? (
							<div className="text-center py-16 text-[#2f3e36] text-sm">
								Este agente no tiene contactos.
							</div>
						) : (
							<Table headers={["ID", "Nombre", "Plataforma", "Tipo", "Última interacción", "Acciones"]} cols={6}>
								{contacts.map((c) => (
									<TableRow key={c.id} cols={6} className="grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]">
										<span className="text-sm text-[#2f3e36]">{c.contactId}</span>
										<EditableCell
											value={c.name || ""}
											onSave={(val) => handleNameSave(c.contactId, val)}
										/>
										<span className="text-sm text-[#2f3e36]">{c.platform}</span>
										<span className="text-sm text-[#2f3e36]">{c.chatType}</span>
										<span className="text-sm text-[#2f3e36]/60">{formatDate(c.lastInteractionAt)}</span>
										<div className="flex items-center gap-3">
											<button
												onClick={() => openEdit(c)}
												className="text-[#A18E6E] hover:opacity-70 transition-opacity text-sm"
											>
												Editar
											</button>
											<button
												onClick={() => setDeleteTarget(c)}
												className="text-red-600 hover:text-red-800 transition-colors text-sm"
											>
												Eliminar
											</button>
										</div>
									</TableRow>
								))}
							</Table>
						)}
					</>
				)}
			</div>

			{/* CREATE / EDIT MODAL */}
			<Modal
				open={showModal}
				title={editTarget ? "Editar contacto" : "Nuevo contacto"}
				onClose={() => !saving && setShowModal(false)}
			>
				<div className="flex flex-col gap-4">
					{!editTarget && (
						<div className="flex flex-col gap-1.5">
							<label className="text-[#2f3e36] text-xs ml-1">ID de contacto</label>
							<input
								value={formData.contactId}
								onInput={(e) => setFormData({ ...formData, contactId: e.target.value })}
								placeholder="ej. 52123456789"
								className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-3 text-sm"
								autoFocus={!editTarget}
							/>
						</div>
					)}
					<div className="flex flex-col gap-1.5">
						<label className="text-[#2f3e36] text-xs ml-1">Nombre</label>
						<input
							value={formData.name}
							onInput={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="ej. Juan Pérez"
							className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-3 text-sm"
							autoFocus={!!editTarget}
						/>
					</div>
					<div className="flex gap-3">
						<div className="flex flex-col gap-1.5 flex-1">
							<label className="text-[#2f3e36] text-xs ml-1">Plataforma</label>
							<select
								value={formData.platform}
								onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
								className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-3 text-sm"
							>
								{PLATFORMS.map((p) => (
									<option key={p} value={p}>{p}</option>
								))}
							</select>
						</div>
						<div className="flex flex-col gap-1.5 flex-1">
							<label className="text-[#2f3e36] text-xs ml-1">Tipo</label>
							<select
								value={formData.chatType}
								onChange={(e) => setFormData({ ...formData, chatType: e.target.value })}
								className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-3 text-sm"
							>
								{CHAT_TYPES.map((t) => (
									<option key={t} value={t}>{t}</option>
								))}
							</select>
						</div>
					</div>
					<div className="flex justify-end gap-3 mt-2">
						<button
							onClick={() => setShowModal(false)}
							disabled={saving}
							className="text-[#2f3e36] px-4 py-2 rounded-full text-sm hover:opacity-70 transition-opacity disabled:opacity-50"
						>
							Cancelar
						</button>
						<button
							onClick={handleSave}
							disabled={saving}
							className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2 rounded-full text-sm font-bold hover:bg-[#2f3a30] transition-colors disabled:opacity-50"
						>
							{saving ? "Guardando..." : editTarget ? "Guardar cambios" : "Crear contacto"}
						</button>
					</div>
				</div>
			</Modal>

			{/* DELETE CONFIRM */}
			<Modal
				open={!!deleteTarget}
				title="Eliminar contacto"
				onClose={() => setDeleteTarget(null)}
			>
				<p className="text-sm text-[#2f3e36] mb-6 text-left">
					¿Estás seguro de eliminar el contacto{" "}
					<strong>"{deleteTarget?.name || deleteTarget?.contactId}"</strong>?
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
