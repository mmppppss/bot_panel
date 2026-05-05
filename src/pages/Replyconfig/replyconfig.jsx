import { useState } from "react"

export function WhabotConfig() {

    const [step, setStep] = useState(1)

    // módulos
    const [whatsapp, setWhatsapp] = useState(false)
    const [telegram, setTelegram] = useState(false)

    const steps = [
        { id: 1, label: "Datos" },
        { id: 2, label: "Modulos" },
        { id: 3, label: "Conexion" },
        { id: 4, label: "Finalizar" }
    ]

    const handleNext = () => step < 4 && setStep(step + 1)
    const handlePrev = () => step > 1 && setStep(step - 1)

    return (

        <div className="flex flex-col items-center justify-center w-full h-screen bg-[#d1d5d0] font-light pl-20">

            <div className="flex flex-row items-start gap-12 w-full max-w-4xl">

                {/* CONTENIDO */}
                <div className="flex-1 flex flex-col min-h-[400px]">

                    {/* TÍTULO */}
                    <h2 className="text-[34px] text-[#2f3e36] mb-10 tracking-[0.15em] font-light uppercase text-center mr-28">
                        {steps.find(s => s.id === step).label}
                    </h2>

                    <div className="flex-grow">

                        {/* PASO 1 */}
                        {step === 1 && (
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[#2f3e36] text-sm ml-1">Nombre</label>

                                    <input
                                        type="text"
                                        className="w-full h-11 rounded-xl bg-[#e0e4df] border-none outline-none px-4 text-sm"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[#2f3e36] text-sm ml-1">Descripcion</label>

                                    <textarea
                                        className="w-full h-24 rounded-xl bg-[#e0e4df] border-none outline-none p-4 text-sm resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* PASO 2 */}
                        {step === 2 && (

                            <div className="flex flex-col gap-5 pt-2">

                                {/* WHATSAPP */}
                                <div className="flex items-center justify-between w-[680px] h-14 bg-[#b2b8af] rounded-full px-6">

                                    <span className="text-[#2f3e36] text-base">
                                        Whatsapp
                                    </span>

                                    <button
                                        onClick={() => setWhatsapp(!whatsapp)}
                                        className={`w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1
                                        ${whatsapp ? "bg-[#2f3e36]" : "bg-[#d9d9d9]"}`}
                                    >

                                        <div className={`w-5 h-5 rounded-full bg-white transition-all duration-300
                                        ${whatsapp ? "translate-x-7" : ""}`} />

                                    </button>

                                </div>

                                {/* TELEGRAM */}
                                <div className="flex items-center justify-between w-[680px] h-14 bg-[#b2b8af] rounded-full px-6">

                                    <span className="text-[#2f3e36] text-base">
                                        Telegram
                                    </span>

                                    <button
                                        onClick={() => setTelegram(!telegram)}
                                        className={`w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1
                                        ${telegram ? "bg-[#2f3e36]" : "bg-[#d9d9d9]"}`}
                                    >

                                        <div className={`w-5 h-5 rounded-full bg-white transition-all duration-300
                                        ${telegram ? "translate-x-7" : ""}`} />

                                    </button>

                                </div>

                            </div>
                        )}

                        {/* PASO 3 */}
                        {step === 3 && (
                            <div className="flex flex-col gap-4">

                                <div className="flex items-center justify-between bg-[#b2b8af] rounded-2xl p-6">

                                    <span className="text-xl text-[#2f3e36]">
                                        Whatsapp
                                    </span>

                                    <div className="bg-white p-1.5 rounded-md">
                                        <div className="w-16 h-16 bg-black" />
                                    </div>

                                </div>

                                <div className="bg-[#b2b8af] rounded-2xl p-6 flex flex-col gap-3">

                                    <span className="text-xl text-[#2f3e36]">
                                        Telegram
                                    </span>

                                    <input
                                        placeholder="Ingresa tu Key"
                                        className="w-full h-10 rounded-full bg-[#e0e4df] px-5 outline-none text-sm"
                                    />

                                </div>

                            </div>
                        )}

                        {/* PASO 4 */}
                        {step === 4 && (
                            <div className="flex flex-col gap-4 pt-6 text-[#2f3e36]">

                                <p className="text-lg font-medium">
                                    Configuración finalizada
                                </p>

                                <p className="text-sm">
                                    Conoce más en nuestra
                                    <span className="text-[#a67c52] underline cursor-pointer">
                                        {" "}documentación
                                    </span>
                                </p>

                                <p className="text-sm opacity-80 italic">
                                    Puedes probar tu bot enviando
                                    <span className="text-[#a67c52] font-bold">
                                        {" "}/ayuda
                                    </span>
                                    {" "}a la sesión configurada
                                </p>

                            </div>
                        )}

                    </div>

                    {/* BOTONES */}
                    <div className="flex items-center justify-center gap-8 mt-10">

                        {step > 1 && (
                            <button
                                onClick={handlePrev}
                                className="text-[#a67c52] text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
                            >
                                Anterior
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            className="bg-[#2f3e36] text-[#a67c52] px-10 py-2.5 rounded-full text-sm tracking-widest uppercase hover:opacity-90 transition-all shadow-sm"
                        >
                            {step === 4 ? "Finalizar" : "Siguiente"}
                        </button>

                    </div>

                </div>

                {/* STEPPER */}
                <div className="w-48 bg-[#b2b8af] rounded-[24px] p-8 py-12 flex flex-col gap-6 shadow-sm">

                    {steps.map((s) => (

                        <div
                            key={s.id}
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setStep(s.id)}
                        >

                            <div className={`w-2 h-2 rounded-full
                            ${step === s.id
                                    ? "bg-[#a67c52]"
                                    : "bg-transparent border border-[#a67c52]/30"
                                }`}
                            />

                            <span className={`text-sm
                            ${step === s.id
                                    ? "text-[#2f3e36] font-semibold"
                                    : "text-[#2f3e36]/40"
                                }`}
                            >
                                {s.label}
                            </span>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}