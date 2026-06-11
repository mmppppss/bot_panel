import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import * as XLSX from "xlsx";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNotify } from "../../components/Notify/NotifyContext";
import { getAgents, getModules, upsertModule, uploadKnowledge } from "../../services/agents";
import { Table, TableRow } from "../../components/Table";
import { LuUpload } from "react-icons/lu";

const HEADERS = ["id", "nombre", "descripcion", "precio", "stock", "fotos", "caracteristicas", "etiquetas"];
const STEPS = ["Datos", "Previsualizar", "Confirmar", "Listo"];
const MODELS = [
	"openrouter/owl-alpha",
	"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
	"moonshotai/kimi-k2.6:free",
	"google/gemma-4-26b-a4b-it:free",
	"qwen/qwen3-next-80b-a3b-instruct:free"
];

function normalizeRows(rows) {
	return rows.map((r) => {
		const fotos = r.fotos
			? String(r.fotos).split(";").map((f) => f.trim()).filter(Boolean)
			: [];
		const caracteristicas = r.caracteristicas
			? String(r.caracteristicas).split("\n").map((c) => {
				const sep = c.indexOf(":");
				if (sep > 0) return { clave: c.slice(0, sep).trim(), valor: c.slice(sep + 1).trim() };
				return { clave: "", valor: c.trim() };
			}).filter((c) => c.clave || c.valor)
			: [];
		const etiquetas = r.etiquetas
			? String(r.etiquetas).split(",").map((t) => t.trim()).filter(Boolean)
			: [];
		return {
			id: String(r.id || ""),
			nombre: String(r.nombre || ""),
			descripcion: String(r.descripcion || ""),
			precio: r.precio ? Number(r.precio) : null,
			stock: r.stock ? Number(r.stock) : null,
			fotos,
			caracteristicas,
			etiquetas,
		};
	});
}

function downloadTemplate() {
	const wb = XLSX.utils.book_new();
	const ws = XLSX.utils.aoa_to_sheet([
		HEADERS,
		[
			"PROD-001",
			"Laptop XYZ",
			"Laptop de última generación",
			15999.99,
			25,
			"https://ejemplo.com/foto1.jpg;https://ejemplo.com/foto2.jpg",
			"RAM: 16GB\nDisco: 512GB SSD",
			"electronica,laptop",
		],
	]);
	ws["!cols"] = HEADERS.map(() => ({ wch: 20 }));
	XLSX.utils.book_append_sheet(wb, ws, "Productos");
	const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
	const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "plantilla_conocimiento.xlsx";
	a.click();
	URL.revokeObjectURL(url);
}

export function Knowledge() {
	const { loading: authLoading, isAuthenticated } = useRequireAuth();
	const { user } = useAuth();
	const { notify } = useNotify();

	const [agents, setAgents] = useState([]);
	const [selectedAgent, setSelectedAgent] = useState("");
	const [step, setStep] = useState(1);
	const [rawRows, setRawRows] = useState([]);
	const [normalized, setNormalized] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [modules, setModules] = useState({});
	const [plnSaving, setPlnSaving] = useState(false);
	const fileRef = useRef(null);

	const loadAgents = () => {
		if (!user?.id) return;
		getAgents(user.id)
			.then((res) => setAgents(res.data || []))
			.catch((err) => notify(err.message, "error"));
	};

	useEffect(() => { loadAgents(); }, []);

	useEffect(() => {
		if (!selectedAgent) {
			setModules({});
			return;
		}
		getModules(user.id, selectedAgent)
			.then((res) => {
				const modMap = {};
				(res.data || []).forEach((m) => { modMap[m.moduleKey] = m; });
				setModules(modMap);
			})
			.catch((err) => notify(err.message, "error"));
	}, [selectedAgent]);

	const handleFile = useCallback(async (file) => {
		if (!file) return;
		const ext = file.name.split(".").pop().toLowerCase();
		let rows = [];

		try {
			if (ext !== "xlsx" && ext !== "xls") {
				notify("Formato no soportado. Usa XLSX.", "error");
				return;
			}
			const buf = await file.arrayBuffer();
			const wb = XLSX.read(buf, { type: "array" });
			const ws = wb.Sheets[wb.SheetNames[0]];
			const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
			rows = json.map((r) => {
				const row = {};
				Object.keys(r).forEach((k) => { row[k.toLowerCase()] = String(r[k]); });
				return row;
			});

			if (rows.length === 0) {
				notify("El archivo está vacío o no tiene datos válidos.", "error");
				return;
			}

			setRawRows(rows);
			setNormalized(normalizeRows(rows));
			setStep(2);
		} catch (err) {
			notify("Error al leer el archivo: " + err.message, "error");
		}
	}, [notify]);

	const handleDrop = useCallback((e) => {
		e.preventDefault();
		const file = e.dataTransfer?.files?.[0];
		if (file) handleFile(file);
	}, [handleFile]);

	const handleFileInput = (e) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	};

	const handleSend = async () => {
		if (!selectedAgent) {
			notify("Selecciona un agente primero", "error");
			return;
		}
		setUploading(true);
		try {
			await uploadKnowledge(selectedAgent, normalized);
			notify("Datos enviados correctamente", "success");
			setStep(4);
		} catch (err) {
			notify(err.message, "error");
		} finally {
			setUploading(false);
		}
	};

	const handleReset = () => {
		setRawRows([]);
		setNormalized([]);
		setStep(1);
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

	const handleSavePLN = async () => {
		if (!selectedAgent) return;
		setPlnSaving(true);
		try {
			await upsertModule(user.id, selectedAgent, "pln", {
				enabled: modules.pln?.enabled ?? false,
				priority: 1,
				config: modules.pln?.config || {},
			});
			notify("Personalidad guardada", "success");
		} catch (err) {
			notify(err.message, "error");
		} finally {
			setPlnSaving(false);
		}
	};

	if (authLoading || !isAuthenticated) return null;

	const renderStepContent = () => {
		switch (step) {
			case 1:
				return (
					<>
						{/* DOWNLOAD TEMPLATE */}
						<button
							onClick={downloadTemplate}
							className="text-[#A18E6E] text-sm underline hover:opacity-70 transition-opacity mb-6 block"
						>
							Descargar plantilla
						</button>

						{/* UPLOAD AREA */}
						<div
							onDragOver={(e) => e.preventDefault()}
							onDrop={handleDrop}
							onClick={() => fileRef.current?.click()}
							className="w-full h-48 rounded-2xl bg-[#B1B2B5] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#a0a2a5] transition-colors border-2 border-dashed border-[#2f3e36]/30"
						>
							<LuUpload className="w-10 h-10 text-[#2f3e36]/60" />
							<span className="text-[#2f3e36] text-sm">
								Arrastra un archivo aquí o haz clic para seleccionar
							</span>
							<span className="text-[#2f3e36]/50 text-xs">
								XLSX
							</span>
						</div>
						<input
							ref={fileRef}
							type="file"
							accept=".xlsx,.xls"
							className="hidden"
							onChange={handleFileInput}
						/>
					</>
				);

			case 2:
				return (
					<>
						<p className="text-sm text-[#2f3e36]/60 mb-4 text-left">
							Se encontraron <strong>{normalized.length}</strong> registros. Revisa los datos antes de continuar.
						</p>

						<div className="max-h-80 overflow-y-auto">
							<Table headers={["ID", "Nombre", "Descripción", "Precio", "Stock"]} cols={5}>
								{normalized.map((r, i) => (
									<TableRow key={i} cols={5} className="grid-cols-[1fr_1.5fr_2fr_1fr_1fr]">
										<span className="text-sm text-[#2f3e36]">{r.id}</span>
										<span className="text-sm text-[#2f3e36] truncate">{r.nombre}</span>
										<span className="text-sm text-[#2f3e36]/70 truncate">{r.descripcion || "—"}</span>
										<span className="text-sm text-[#2f3e36]">{r.precio !== null ? "$" + r.precio : "—"}</span>
										<span className="text-sm text-[#2f3e36]">{r.stock !== null ? r.stock : "—"}</span>
									</TableRow>
								))}
							</Table>
						</div>

						<div className="flex gap-3 mt-4">
							<button
								onClick={handleReset}
								className="text-[#2f3e36] px-5 py-2 rounded-full text-sm border border-[#2f3e36]/30 hover:bg-[#2f3e36]/5 transition-colors"
							>
								Limpiar y empezar de nuevo
							</button>
						</div>
					</>
				);

			case 3: {
				const withPrice = normalized.filter((r) => r.precio !== null).length;
				const withStock = normalized.filter((r) => r.stock !== null).length;
				const totalEtiquetas = normalized.reduce((acc, r) => acc + r.etiquetas.length, 0);
				return (
					<>
						<p className="text-sm text-[#2f3e36]/60 mb-6 text-left">
							Se enviarán <strong>{normalized.length}</strong> registros al agente <strong>{agents.find((a) => a.id === selectedAgent)?.name}</strong>.
						</p>

						<div className="bg-[#B1B2B5] rounded-2xl p-6 flex flex-col gap-4">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="bg-[#e0e4df] rounded-xl p-4 text-left">
									<span className="text-2xl font-light text-[#2f3e36] block">{normalized.length}</span>
									<span className="text-xs text-[#2f3e36]/60">Registros</span>
								</div>
								<div className="bg-[#e0e4df] rounded-xl p-4 text-left">
									<span className="text-2xl font-light text-[#2f3e36] block">{withPrice}</span>
									<span className="text-xs text-[#2f3e36]/60">Con precio</span>
								</div>
								<div className="bg-[#e0e4df] rounded-xl p-4 text-left">
									<span className="text-2xl font-light text-[#2f3e36] block">{withStock}</span>
									<span className="text-xs text-[#2f3e36]/60">Con stock</span>
								</div>
								<div className="bg-[#e0e4df] rounded-xl p-4 text-left">
									<span className="text-2xl font-light text-[#2f3e36] block">{totalEtiquetas}</span>
									<span className="text-xs text-[#2f3e36]/60">Etiquetas</span>
								</div>
							</div>

							<div className="max-h-52 overflow-y-auto">
								<div className="grid grid-cols-[1fr_1fr_auto_auto] gap-x-4 gap-y-1 text-sm">
									<span className="text-[#2f3e36]/40 text-xs uppercase tracking-wider text-left">ID</span>
									<span className="text-[#2f3e36]/40 text-xs uppercase tracking-wider text-left">Nombre</span>
									<span className="text-[#2f3e36]/40 text-xs uppercase tracking-wider text-right">Precio</span>
									<span className="text-[#2f3e36]/40 text-xs uppercase tracking-wider text-right">Stock</span>
									{normalized.slice(0, 10).map((r, i) => (
										<>
											<span key={"id-" + i} className="text-[#2f3e36] truncate text-left">{r.id}</span>
											<span key={"nm-" + i} className="text-[#2f3e36] truncate text-left">{r.nombre}</span>
											<span key={"pr-" + i} className="text-[#2f3e36] text-right">{r.precio !== null ? "$" + r.precio : "—"}</span>
											<span key={"st-" + i} className="text-[#2f3e36] text-right">{r.stock !== null ? r.stock : "—"}</span>
										</>
									))}
								</div>
								{normalized.length > 10 && (
									<p className="text-xs text-[#2f3e36]/40 mt-2 text-left">... y {normalized.length - 10} más</p>
								)}
							</div>
						</div>
					</>
				);
			}

			case 4:
				return (
					<div className="flex flex-col items-center justify-center py-12 gap-4">
						<div className="w-16 h-16 rounded-full bg-[#2f3e36] flex items-center justify-center">
							<svg className="w-8 h-8 text-[#A18E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<p className="text-lg font-medium text-[#2f3e36]">Datos cargados correctamente</p>
						<button
							onClick={handleReset}
							className="bg-[#3D4A3E] text-[#A18E6E] px-8 py-2.5 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#2f3a30] transition-colors"
						>
							Subir otro archivo
						</button>
					</div>
				);
		}
	};

	return (
		<div className="min-h-screen flex items-start justify-center px-7 py-8">
			<div className="w-full max-w-4xl flex gap-6">

				{/* CONTENT */}
				<div className="flex-1 flex flex-col">
					<div className="mb-8">
						<h1 className="text-4xl font-light text-[#2f3e36] text-left">
							Conocimiento
						</h1>
					</div>

					{/* AGENT SELECTOR */}
					<div className="mb-6 max-w-xs">
						<label className="text-[#2f3e36] text-sm ml-1 block mb-1.5">Agente</label>
						<select
							value={selectedAgent}
							onChange={(e) => setSelectedAgent(e.target.value)}
							className="w-full h-10 rounded-xl bg-[#e0e4df] border-none outline-none px-4 text-sm"
						>
							<option value="">-- Seleccionar --</option>
							{agents.map((a) => (
								<option key={a.id} value={a.id}>{a.name}</option>
							))}
						</select>
					</div>

					{/* PERSONALIDAD */}
					{selectedAgent && (
						<div className="bg-[#b2b8af] rounded-2xl p-5 mb-6">
							<span className="text-[#2f3e36] text-base font-medium block mb-4">Personalidad</span>
							<div className="flex flex-col gap-4 pl-1">
								<div className="flex flex-col gap-1.5">
									<label className="text-[#2f3e36] text-xs ml-1">Personalidad</label>
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
								<div className="flex justify-start">
									<button
										onClick={handleSavePLN}
										disabled={plnSaving}
										className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-2 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#2f3a30] transition-colors disabled:opacity-50"
									>
										{plnSaving ? "Guardando..." : "Guardar personalidad"}
									</button>
								</div>
							</div>
						</div>
					)}

					<hr className="border-[#2f3e36]/20 my-6" />

					<div className="flex items-center justify-center mb-6">
						{STEPS.map((label, i) => (
							<div key={i} className="flex items-center">
								{i > 0 && <div className="w-8 h-px bg-[#2f3e36]/20 mx-2" />}
								<div className="flex items-center gap-1.5">
									<div
										className={`w-[18px] h-[18px] rounded-full transition-all duration-300 shrink-0 ${step === i + 1 ? "bg-[#2f3e36]" : "bg-[#2f3e36]/20"}`}
									/>
									<span className={`text-[10px] uppercase tracking-wider hidden sm:inline ${step === i + 1 ? "text-[#2f3e36] font-bold" : "text-[#2f3e36]/40"}`}>
										{label}
									</span>
								</div>
							</div>
						))}
					</div>

					<h2 className="text-xl font-light text-[#2f3e36] text-left mb-4">
						{STEPS[step - 1]}
					</h2>

					<div className="flex-1">
						{renderStepContent()}
					</div>

					{/* BOTTOM BUTTON */}
					{step === 1 && (
						<div className="flex justify-end mt-8">
							<div className="bg-[#2f3e36]/40 rounded-full px-10 py-3">
								<span className="text-[#A18E6E]/40 uppercase tracking-widest text-sm font-bold">
									SIGUIENTE
								</span>
							</div>
						</div>
					)}
					{step === 2 && (
						<div className="flex justify-end mt-6">
							<button
								onClick={() => setStep(3)}
								className="bg-[#2f3e36] text-[#A18E6E] px-10 py-3 rounded-full uppercase tracking-widest text-sm font-bold shadow-lg hover:bg-[#2f3a30] transition-colors"
							>
								SIGUIENTE
							</button>
						</div>
					)}
					{step === 3 && (
						<div className="flex justify-end mt-6 gap-4">
							<button
								onClick={() => setStep(2)}
								className="text-[#2f3e36] px-5 py-3 rounded-full text-sm hover:opacity-70 transition-opacity"
							>
								Anterior
							</button>
							<button
								onClick={handleSend}
								disabled={uploading}
								className="bg-[#2f3e36] text-[#A18E6E] px-10 py-3 rounded-full uppercase tracking-widest text-sm font-bold shadow-lg hover:bg-[#2f3a30] transition-colors disabled:opacity-50"
							>
								{uploading ? "Enviando..." : "ENVIAR"}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
