import { useState } from "react";
import { apiRequest } from "../../helpers/api";
// --- Sub-componentes de Pasos ---

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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                <div className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${active ? "translate-x-7" : ""}`} />
            </button>
        </div>
    );

    return (
        <div className="flex flex-col gap-5 pt-6">
            <Toggle label="Whatsapp" active={whatsapp} onToggle={() => setWhatsapp(!whatsapp)} />
            <Toggle label="Telegram" active={telegram} onToggle={() => setTelegram(!telegram)} />
        </div>
    );
};

const StepConexion = ({ telegramKey, setTelegramKey }) => (
    <div className="flex flex-col gap-4 pt-6">
        <div className="flex items-center justify-between bg-[#b2b8af] rounded-2xl p-5">
            <span className="text-xl text-[#2f3e36] font-medium text-left">Whatsapp</span>
            <div className="bg-white p-1 rounded-lg shadow-sm">
                <div className="w-20 h-20 bg-black" />
            </div>
        </div>

        <div className="bg-[#b2b8af] rounded-2xl p-5 flex flex-col gap-3">
            <span className="text-xl text-[#2f3e36] font-medium text-left">Telegram</span>
            <input
                value={telegramKey}
                onChange={(e) => setTelegramKey(e.target.value)}
                placeholder="Ingresa tu Api Key"
                className="w-full h-10 rounded-full bg-[#e0e4df] px-5 outline-none text-sm border-none"
            />
        </div>
    </div>
);

const StepFinalizar = () => (
    <div className="flex flex-col gap-4 pt-6 text-[#2f3e36]">
        <p className="text-lg font-medium text-left">Configuración finalizada</p>
        <p className="text-sm text-left">
            Tu agente ha sido creado y los módulos están listos.
        </p>
    </div>
);

// --- Componente Principal ---

export function AgentCreator() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Estados de persistencia
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [whatsapp, setWhatsapp] = useState(false);
    const [telegram, setTelegram] = useState(false);
    const [telegramKey, setTelegramKey] = useState("");

    const steps = [
        { id: 1, label: "Datos" },
        { id: 2, label: "Modulos" },
        { id: 3, label: "Conexion" },
        { id: 4, label: "Finalizar" },
    ];

    const handleSubmit = async () => {
        setLoading(true);
        const id_user = localStorage.getItem("id_user");

        try {
            // Ejecutamos tu función con los datos guardados
            await apiRequest("user/" + id_user + "/agents/", "POST", {
                name: formData.name,
                description: formData.description
            });
            // Si la petición es exitosa, avanzamos al siguiente paso (Conexión)
            setStep(3);
        } catch (error) {
            console.error("Error al crear el agente:", error);
            alert("Hubo un error al crear el agente. Revisa los datos.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 2) {
            // Disparar petición al terminar el paso 2
            handleSubmit();
        } else if (step < 4) {
            setStep(step + 1);
        }
    };

    const handlePrev = () => step > 1 && !loading && setStep(step - 1);

    const renderStepContent = () => {
        switch (step) {
            case 1: return <StepDatos formData={formData} setFormData={setFormData} />;
            case 2: return <StepModulos whatsapp={whatsapp} setWhatsapp={setWhatsapp} telegram={telegram} setTelegram={setTelegram} />;
            case 3: return <StepConexion telegramKey={telegramKey} setTelegramKey={setTelegramKey} />;
            case 4: return <StepFinalizar />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#D1D5D2] p-4">
            <div className="grid grid-cols-5 grid-rows-5 gap-4 w-full max-w-4xl h-[550px] text-[#4A554D] ml-[15%]">

                <div className="col-span-3 row-start-1 flex items-end">
                    <h2 className="text-4xl font-light text-left">{steps[step - 1].label}</h2>
                </div>

                <div className="col-span-3 row-start-2 row-span-3 text-left">
                    {renderStepContent()}
                </div>

                <div className="col-span-3 row-start-5 flex items-center justify-end">
                    <button
                        onClick={handlePrev}
                        disabled={step === 1 || loading}
                        className={`text-[#A18E6E] m-8 uppercase tracking-widest text-sm font-bold transition-opacity ${step === 1 ? "opacity-0 pointer-events-none" : "hover:opacity-80"}`}
                    >
                        Anterior
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="bg-[#3D4A3E] text-[#A18E6E] px-16 py-3 rounded-full uppercase tracking-widest text-sm font-bold shadow-lg hover:bg-[#2f3a30] transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creando..." : "Siguiente"}
                    </button>
                </div>

                <div className="col-span-2 col-start-4 row-span-5 row-start-1">
                    <div className="bg-[#B4BCB4] h-full w-[65%] rounded-2xl p-10 pt-16 flex flex-col space-y-8 text-sm">
                        {steps.map((s) => (
                            <div key={s.id} className={`flex items-center gap-3 transition-opacity duration-300 ${step === s.id ? "opacity-100" : "opacity-40"}`}>
                                <div className={`w-2 h-2 rounded-full ${step === s.id ? "bg-[#A18E6E]" : "bg-transparent"}`} />
                                <span className="font-bold uppercase tracking-wider text-left">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}