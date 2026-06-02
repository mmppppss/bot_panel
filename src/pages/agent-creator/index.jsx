import { useState } from "react";
import { apiRequest } from "../../helpers/api";
import { getWhatsappQR, connectTelegram } from "../../services/agents";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNotify } from "../../components/Notify/NotifyContext";
import QRCode from "react-qr-code";

const StepDatos = ({ formData, setFormData }) => (
	<div className="flex flex-col gap-5 pt-6">
		<div className="flex flex-col gap-1.5">
			<label className="text-[#2f3e36] text-sm ml-1">Nombre</label>
			<input
				type="text"
				value={formData.name}
				onChange={(e) => setFormData({ ...formData, name: e.target.value })}
				className="w-full h-11 rounded-xl bg-[#e0e4df] border-none outline-none px-4 text-sm"
			/>
		</div>
		<div className="flex flex-col gap-1.5">
			<label className="text-[#2f3e36] text-sm ml-1">Descripción</label>
			<textarea
				value={formData.description}
				onChange={(e) =>
					setFormData({ ...formData, description: e.target.value })
				}
				className="w-full h-24 rounded-xl bg-[#e0e4df] border-none outline-none p-4 text-sm resize-none"
			/>
		</div>
	</div>
);

const StepModulos = ({ whatsapp, setWhatsapp, telegram, setTelegram }) => {
	const Toggle = ({ label, active, onToggle }) => (
		<div className="flex items-center justify-between w-full h-14 bg-[#b2b8af] rounded-full px-6">
			<span className="text-[#2f3e36] text-base">{label}</span>
			<button
				onClick={onToggle}
				className={`w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 ${active ? "bg-[#2f3e36]" : "bg-[#d9d9d9]"}`}
			>
				<div
					className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${active ? "translate-x-7" : ""}`}
				/>
			</button>
		</div>
	);

	return (
		<div className="flex flex-col gap-5 pt-6">
			<Toggle
				label="Whatsapp"
				active={whatsapp}
				onToggle={() => setWhatsapp(!whatsapp)}
			/>
			<Toggle
				label="Telegram"
				active={telegram}
				onToggle={() => setTelegram(!telegram)}
			/>
		</div>
	);
};

const StepConexion = ({ whatsapp, telegram, telegramKey, setTelegramKey, code }) => {
	const hasModules = whatsapp || telegram;

	if (!hasModules) {
		return (
			<div className="flex flex-col gap-4 pt-6">
				<p className="text-[#2f3e36] text-sm">No seleccionaste ningún módulo para conectar.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 pt-6">
			{whatsapp && (
				<div className="flex items-center justify-between bg-[#b2b8af] rounded-2xl p-5">
					<span className="text-xl text-[#2f3e36] font-medium text-left">Whatsapp</span>
					<div className="bg-white p-1 rounded-lg shadow-sm">
						{code ? (
							<QRCode className="w-40 h-40" value={code} />
						) : (
							<div className="w-40 h-40 flex items-center justify-center text-sm text-[#2f3e36]">
								Cargando QR...
							</div>
						)}
					</div>
				</div>
			)}
			{telegram && (
				<div className="bg-[#b2b8af] rounded-2xl p-5 flex flex-col gap-3">
					<span className="text-xl text-[#2f3e36] font-medium text-left">Telegram</span>
					<input
						value={telegramKey}
						onChange={(e) => setTelegramKey(e.target.value)}
						placeholder="Ingresa el token de Telegram"
						className="w-full h-10 rounded-full bg-[#e0e4df] px-5 outline-none text-sm border-none"
					/>
				</div>
			)}
		</div>
	);
};

const StepFinalizar = () => (
	<div className="flex flex-col gap-4 pt-6 text-[#2f3e36]">
		<p className="text-lg font-medium text-left">Configuración finalizada</p>
		<p className="text-sm text-left">
			Tu agente ha sido creado y los módulos están listos.
		</p>
	</div>
);

export function AgentCreator() {
	const { loading: authLoading, isAuthenticated } = useRequireAuth();
	const { user } = useAuth();
	const { notify } = useNotify();

	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({ name: "", description: "" });
	const [whatsapp, setWhatsapp] = useState(false);
	const [telegram, setTelegram] = useState(false);
	const [telegramKey, setTelegramKey] = useState("");
	const [agentId, setAgentId] = useState(null);
	const [code, setCode] = useState("");

	const steps = [
		{ id: 1, label: "Datos" },
		{ id: 2, label: "Modulos" },
		{ id: 3, label: "Conexion" },
		{ id: 4, label: "Finalizar" },
	];

	const handleSubmit = async () => {
		setLoading(true);

		try {
			let currentAgentId = agentId;

			if (!currentAgentId) {
				const req = await apiRequest("user/" + user.id + "/agents/", "POST", {
					name: formData.name,
					description: formData.description,
				});
				currentAgentId = req.data.id;
				setAgentId(currentAgentId);
			}

			let qrCode = "";
			if (whatsapp) {
				const res = await getWhatsappQR(user.id, currentAgentId);
				qrCode = res.data;
			}
			setCode(qrCode);
			setStep(3);
		} catch (error) {
			console.error("Error al crear el agente:", error);
			notify(err.message, "error");
		} finally {
			setLoading(false);
		}
	};

	const handleConnect = async () => {
		setLoading(true);

		try {
			if (telegram && telegramKey.trim()) {
				await connectTelegram(user.id, agentId, telegramKey);
			}
			setStep(4);
		} catch (error) {
			console.error("Error al conectar:", error);
			notify(err.message, "error");
		} finally {
			setLoading(false);
		}
	};

	const handleNext = () => {
		if (step === 2) {
			handleSubmit();
		} else if (step === 3) {
			handleConnect();
		} else if (step < 4) {
			setStep(step + 1);
		}
	};

	if (authLoading || !isAuthenticated) return null;

	const handlePrev = () => step > 1 && !loading && setStep(step - 1);

	const nextLabel = () => {
		if (loading) return "Creando...";
		if (step === 3) return "Conectar";
		return "Siguiente";
	};

	const renderStepContent = () => {
		switch (step) {
			case 1:
				return <StepDatos formData={formData} setFormData={setFormData} />;
			case 2:
				return (
					<StepModulos
						whatsapp={whatsapp}
						setWhatsapp={setWhatsapp}
						telegram={telegram}
						setTelegram={setTelegram}
					/>
				);
			case 3:
				return (
					<StepConexion
						whatsapp={whatsapp}
						telegram={telegram}
						telegramKey={telegramKey}
						setTelegramKey={setTelegramKey}
						code={code}
					/>
				);
			case 4:
				return <StepFinalizar />;
			default:
				return null;
		}
	};

	return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#D1D5D2] p-4">
			<div className="flex flex-col md:grid md:grid-cols-5 md:grid-rows-5 gap-6 md:gap-4 w-full max-w-4xl md:h-[550px] text-[#4A554D]">
				<div className="md:col-span-3 md:row-start-1 flex items-end">
					<h2 className="text-4xl font-light text-left">
						{steps[step - 1].label}
					</h2>
				</div>

				<div className="md:col-span-3 md:row-start-2 md:row-span-3 text-left">
					{renderStepContent()}
				</div>

				<div className="md:col-span-3 md:row-start-5 flex items-center justify-end gap-4">
					<button
						onClick={handlePrev}
						disabled={step === 1 || loading}
						className={`text-[#A18E6E] uppercase tracking-widest text-sm font-bold transition-opacity ${step === 1 ? "opacity-0 pointer-events-none" : "hover:opacity-80"}`}
					>
						Anterior
					</button>

					<button
						onClick={handleNext}
						disabled={loading}
						className="bg-[#3D4A3E] text-[#A18E6E] px-10 md:px-16 py-3 rounded-full uppercase tracking-widest text-sm font-bold shadow-lg hover:bg-[#2f3a30] transition-colors disabled:opacity-50"
					>
						{nextLabel()}
					</button>
				</div>

				<div className="hidden md:block md:col-span-2 md:col-start-4 md:row-span-5 md:row-start-1">
					<div className="bg-[#B4BCB4] h-full w-[65%] rounded-2xl p-10 pt-16 flex flex-col space-y-8 text-sm">
						{steps.map((s) => (
							<div
								key={s.id}
								className={`flex items-center gap-3 transition-opacity duration-300 ${step === s.id ? "opacity-100" : "opacity-40"}`}
							>
								<div
									className={`w-2 h-2 rounded-full ${step === s.id ? "bg-[#A18E6E]" : "bg-transparent"}`}
								/>
								<span className="font-bold uppercase tracking-wider text-left">
									{s.label}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
