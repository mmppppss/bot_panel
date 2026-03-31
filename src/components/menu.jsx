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
            )}<div className={`flex flex-col fixed top-0 left-0 h-full bg-[var(--color-alt)] z-50 transition-all duration-300 ${open ? "w-64" : "w-20"}`}>

                {/* Botón para cerrar (Solo visible si está abierto, o cambia el icono) */}
                <div className="flex justify-end items-center h-15 pr-3 cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <LuChevronLeft className="w-8 h-8" /> : <LuChevronRight className="w-8 h-8" />}
                </div>

                {/* Ítems del Menú */}
                <div className="flex items-center gap-4 p-6 overflow-hidden">
                    <LuBot className="w-6 h-6 min-w-[24px]" />
                    {open && <span className="whitespace-nowrap transition-opacity duration-300">Chatbot Whabot</span>}
                </div>

                <div className="flex items-center gap-4 p-6 overflow-hidden">
                    <LuBraces className="w-6 h-6 min-w-[24px]" />
                    {open && <span className="whitespace-nowrap">Código y API</span>}
                </div>

                <div className="flex items-center gap-4 p-6 overflow-hidden">
                    <LuChartColumn className="w-6 h-6 min-w-[24px]" />
                    {open && <span className="whitespace-nowrap">Estadísticas</span>}
                </div>

                {/* Elemento inferior (con mt-auto que ya tenías) */}
                <div className={`mt-auto flex items-center h-12 gap-3 bg-[var(--color-back)] m-4 rounded-xl ${open ? "pl-3" : "justify-center"}`}>
                    <LuChartColumn className="w-6 h-6" />
                    {open && <span className="whitespace-nowrap">Reportes</span>}
                </div>
            </div>
            hol
        </>

    )
}