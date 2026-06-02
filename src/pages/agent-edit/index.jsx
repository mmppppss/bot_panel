import { useState, useEffect } from "preact/hooks";
import { useLocation, useRoute } from "preact-iso";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNotify } from "../../components/Notify/NotifyContext";
import { getAgent, updateAgent, getModules, upsertModule, toggleModule } from "../../services/agents";

const MODELS = [
	"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
	"meta-llama/llama-3.2-3b-instruct:free",
	"mistralai/mistral-7b-instruct:free",
	"google/gemini-2.0-flash-exp:free",
];

export function AgentEdit() {
	const { loading: authLoading, isAuthenticated } = useRequireAuth();
	const { user } = useAuth();
	const { route } = useLocation();
	const { notify } = useNotify();
	const { params } = useRoute();
	const id = params?.id;

	const [formData, setFormData] = useState({ name: "", description: "" });
	const [modules, setModules] = useState({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!user?.id || !id) return;

		Promise.all([
			getAgent(user.id, id),
			getModules(user.id, id),
		])
			.then(([agentRes, modulesRes]) => {
				const agent = agentRes.data;
				setFormData({ name: agent.name || "", description: agent.description || "" });

				const modMap = {};
				(modulesRes.data || []).forEach((m) => {
					modMap[m.moduleKey] = m;
				});
				setModules(modMap);
			})
			.catch((err) => {
				notify(err.message, "error");
				route("/agents");
			})
			.finally(() => setLoading(false));
	}, [user, id]);

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleModuleToggle = async (moduleKey, currentEnabled) => {
		try {
			const res = await toggleModule(user.id, id, moduleKey);
			setModules((prev) => ({
				...prev,
				[moduleKey]: { ...prev[moduleKey], enabled: res.data?.enabled ?? !currentEnabled },
			}));
		} catch (err) {
			notify(err.message, "error");
		}
	};

	const handleModuleConfig = (moduleKey, field, value) => {
		setModules((prev) => ({
			...prev,
			[moduleKey]: {
				...prev[moduleKey],
				config: { ...(prev[moduleKey]?.config || {}), [field]: value },
			},
		}));
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			await updateAgent(user.id, id, formData);

			if (modules.pln?.config) {
				await upsertModule(user.id, id, "pln", {
					enabled: modules.pln?.enabled ?? false,
					priority: 1,
					config: modules.pln.config,
				});
			}

			notify("Agente actualizado", "success");
			route("/agents");
		} catch (err) {
			notify(err.message, "error");
		} finally {
			setSaving(false);
		}
	};

	if (authLoading || !isAuthenticated) return null;

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-[#2f3e36] text-sm animate-pulse">Cargando...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-start justify-center px-7 py-8">
			<div className="w-full max-w-2xl">

				<h1 className="text-4xl font-light text-[#2f3e36] text-left mb-8">
					Editar agente
				</h1>

				{/* NOMBRE */}
				<div className="flex flex-col gap-1.5 mb-5">
					<label className="text-[#2f3e36] text-sm ml-1">Nombre</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => handleChange("name", e.target.value)}
						className="w-full h-11 rounded-xl bg-[#e0e4df] border-none outline-none px-4 text-sm"
					/>
				</div>

				{/* DESCRIPCIÓN */}
				<div className="flex flex-col gap-1.5 mb-8">
					<label className="text-[#2f3e36] text-sm ml-1">Descripción</label>
					<textarea
						value={formData.description}
						onChange={(e) => handleChange("description", e.target.value)}
						className="w-full h-24 rounded-xl bg-[#e0e4df] border-none outline-none p-4 text-sm resize-none"
					/>
				</div>

				{/* MÓDULOS */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-5">
						<div className="h-px flex-1 bg-[#b2b8af]" />
						<span className="text-[#2f3e36] text-sm font-medium uppercase tracking-wider">Módulos</span>
						<div className="h-px flex-1 bg-[#b2b8af]" />
					</div>

					<div className="flex flex-col gap-4">
						{/* KEYWORD */}
						<div className="bg-[#b2b8af] rounded-2xl p-5 flex items-center justify-between">
							<div className="flex flex-col">
								<span className="text-[#2f3e36] text-base font-medium text-left">Keyword (Auto-Reply)</span>
								<span
									onClick={() => route("/edit/" + id + "/responses")}
									className="text-[#A18E6E] text-xs cursor-pointer hover:underline text-left mt-1"
								>
									Configurar respuestas
								</span>
							</div>
							<button
								onClick={() => handleModuleToggle("keyword", modules.keyword?.enabled)}
								className={`w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 ${modules.keyword?.enabled ? "bg-[#2f3e36]" : "bg-[#d9d9d9]"}`}
							>
								<div
									className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${modules.keyword?.enabled ? "translate-x-7" : ""}`}
								/>
							</button>
						</div>

						{/* PLN */}
						<div className="bg-[#b2b8af] rounded-2xl p-5">
							<div className="flex items-center justify-between mb-4">
								<span className="text-[#2f3e36] text-base font-medium">PLN (IA)</span>
								<button
									onClick={() => handleModuleToggle("pln", modules.pln?.enabled)}
									className={`w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 ${modules.pln?.enabled ? "bg-[#2f3e36]" : "bg-[#d9d9d9]"}`}
								>
									<div
										className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${modules.pln?.enabled ? "translate-x-7" : ""}`}
									/>
								</button>
							</div>

							{modules.pln?.enabled && (
								<div className="flex flex-col gap-4 pl-1">
									<div className="flex flex-col gap-1.5">
										<label className="text-[#2f3e36] text-xs ml-1">System Prompt</label>
										<textarea
											value={modules.pln?.config?.systemPrompt || ""}
											onChange={(e) => handleModuleConfig("pln", "systemPrompt", e.target.value)}
											className="w-full h-20 rounded-xl bg-[#e0e4df] border-none outline-none p-3 text-sm resize-none"
										/>
									</div>
									<div className="flex flex-col gap-1.5">
										<label className="text-[#2f3e36] text-xs ml-1">Modelo</label>
										<select
											value={modules.pln?.config?.model || MODELS[0]}
											onChange={(e) => handleModuleConfig("pln", "model", e.target.value)}
											className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-3 text-sm"
										>
											{MODELS.map((m) => (
												<option key={m} value={m}>{m}</option>
											))}
										</select>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* BOTONES */}
				<div className="flex items-center justify-end gap-4">
					<button
						onClick={() => route("/agents")}
						disabled={saving}
						className="text-[#2f3e36] px-6 py-2 rounded-full text-sm hover:opacity-70 transition-opacity disabled:opacity-50"
					>
						Cancelar
					</button>
					<button
						onClick={handleSave}
						disabled={saving}
						className="bg-[#3D4A3E] text-[#A18E6E] px-10 py-3 rounded-full uppercase tracking-widest text-sm font-bold shadow-lg hover:bg-[#2f3a30] transition-colors disabled:opacity-50"
					>
						{saving ? "Guardando..." : "Guardar cambios"}
					</button>
				</div>

			</div>
		</div>
	);
}
