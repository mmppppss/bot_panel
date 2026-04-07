import { useState } from "react"
import { LuBot, LuBraces, LuChartColumn, LuChevronLeft, LuChevronRight } from "react-icons/lu"

export function Menu() {

    const [open, setOpen] = useState(false)

    return (

        <>
            <div className="fixed top-5 left-5 z-50">

                <button
                    onClick={() => setOpen(!open)}
                    className="w-[50px] h-[50px] rounded-[12px] bg-[#b2b8af] flex items-center justify-center shadow-md"
                >
                    <span className={`text-[#2f3e36] text-xl transition-transform ${open ? "rotate-90" : ""}`}>
                        &gt;
                    </span>
                </button>

            </div>

            {open && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                />
            )}

            <div className={`flex flex-col fixed top-0 left-0 h-full bg-[var(--color-alt)] z-50 transition-all duration-300 ${open ? "w-64" : "w-20"}`}>

                {/* BOTÓN INTERNO */}
                <div
                    className={`flex items-center h-15 cursor-pointer ${open ? "justify-end pr-3" : "justify-center"}`}
                    onClick={() => setOpen(!open)}
                >
                    {open
                        ? <LuChevronLeft className="w-8 h-8" />
                        : <LuChevronRight className="w-8 h-8" />
                    }
                </div>

                {/* ÍTEMS */}
                <div className={`flex items-center gap-4 overflow-hidden ${open ? "p-6" : "justify-center p-4"}`}>
                    <LuBot className="w-6 h-6 min-w-[24px] flex-shrink-0" />
                    {open && <span className="whitespace-nowrap transition-opacity duration-300">Chatbot Whabot</span>}
                </div>

                <div className={`flex items-center gap-4 overflow-hidden ${open ? "p-6" : "justify-center p-4"}`}>
                    <LuBraces className="w-6 h-6 min-w-[24px] flex-shrink-0" />
                    {open && <span className="whitespace-nowrap">Código y API</span>}
                </div>

                <div className={`flex items-center gap-4 overflow-hidden ${open ? "p-6" : "justify-center p-4"}`}>
                    <LuChartColumn className="w-6 h-6 min-w-[24px] flex-shrink-0" />
                    {open && <span className="whitespace-nowrap">Estadísticas</span>}
                </div>

                {/* ABAJO */}
                <div className={`mt-auto flex items-center h-12 gap-3 bg-[var(--color-back)] m-4 rounded-xl ${open ? "pl-3" : "justify-center"}`}>
                    <LuChartColumn className="w-6 h-6 flex-shrink-0" />
                    {open && <span className="whitespace-nowrap">Reportes</span>}
                </div>

            </div>
        </>

    )
}