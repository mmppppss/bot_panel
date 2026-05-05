import { useState } from "react"
import { useLocation } from 'preact-iso';
import { LuBot, LuBraces, LuChartColumn, LuChevronLeft, LuChevronRight } from "react-icons/lu"

export function Menu() {
    const [open, setOpen] = useState(false)
    const { route } = useLocation();

    return (
        <>
            {/* Overlay para cerrar el menú si haces clic fuera */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            <div className={`flex flex-col fixed top-0 left-0 h-full bg-[#b2b8af] z-50 transition-all duration-300 ${open ? "w-64" : "w-20"}`}>

                {/* BOTÓN INTERNO PARA ABRIR/CERRAR */}
                <div
                    className={`flex items-center h-16 cursor-pointer hover:bg-black/5 select-none ${open ? "justify-end pr-5" : "justify-center"}`}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <LuChevronLeft className="w-8 h-8 text-[#2f3e36]" /> : <LuChevronRight className="w-8 h-8 text-[#2f3e36]" />}
                </div>

                {/* ÍTEMS DEL MENÚ */}
                {/* BOTÓN QUE LLEVA A LA CONFIGURACIÓN ) */}
                <div
                    onClick={() => route("/reply")}
                    className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 select-none transition-colors ${open ? "p-6" : "justify-center p-4"}`}
                >
                    <LuBot className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />
                    {open && <span className="text-[#2f3e36] font-medium whitespace-nowrap">Chatbot Whabot</span>}
                </div>

                <div className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}>
                    <LuBraces className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />
                    {open && <span className="text-[#2f3e36] whitespace-nowrap">Código y API</span>}
                </div>

                <div className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}>
                    <LuChartColumn className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />
                    {open && <span className="text-[#2f3e36] whitespace-nowrap">Estadísticas</span>}
                </div>

                {/* BOTÓN INFERIOR DE REPORTES */}
                <div className={`mt-auto flex items-center h-12 gap-3 bg-[var(--color-back)] m-4 rounded-xl shadow-sm ${open ? "pl-3" : "justify-center"}`}>
                    <LuChartColumn className="w-6 h-6 text-[#2f3e36]" />
                    {open && <span className="text-[#2f3e36] text-sm">Reportes</span>}
                </div>
            </div>
        </>
    )
}




