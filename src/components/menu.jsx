import { useState, useMemo, useEffect } from "react"
import { useLocation } from 'preact-iso';
import { LuBraces, LuListTodo, LuSettings, LuUsers, LuHistory, LuBrain, LuMessageSquare, LuCode, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { icon } from "profile-icon"
import { useAuth } from "../contexts/AuthContext"
import { getAgents, getModules } from "../services/agents"

export function Menu() {

    const [open, setOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { route, path } = useLocation();
    const { user, logout } = useAuth();

    const [showKnowledge, setShowKnowledge] = useState(false)
    const [showKeywords, setShowKeywords] = useState(false)
    const [showDeveloper, setShowDeveloper] = useState(false)

    useEffect(() => {
        if (!user?.id) return
        getAgents(user.id).then((res) => {
            const agents = res.data || []
            const promises = agents.map((a) =>
                getModules(user.id, a.id)
                    .then((modRes) => (modRes.data || []).filter((m) => m.enabled).map((m) => m.moduleKey))
                    .catch(() => [])
            )
            Promise.all(promises).then((results) => {
                const allModules = results.flat()
                setShowKnowledge(allModules.includes("pln"))
                setShowKeywords(allModules.includes("keyword"))
                setShowDeveloper(allModules.includes("developer"))
            })
        }).catch(() => {})
    }, [user, path])

    const avatarUri = useMemo(() => {
        if (!user) return ""
        const seed = user.username || user.email 
        const svg = icon(seed, 60, false, 6)
        return `data:image/svg+xml,${encodeURIComponent(svg)}`
    }, [user])

    const handleLogout = () => {
        setShowUserMenu(false)
        logout()
        route("/login")
    }

    const closeOverlays = () => {
        setOpen(false)
        setShowUserMenu(false)
    }

    return (

        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => closeOverlays()}
                />
            )}

            <div className={`flex flex-col fixed top-0 left-0 h-full bg-[#b2b8af] z-50 transition-all duration-300 ${open ? "w-64" : "w-20"}`}>

                <div
                    className={`flex items-center h-16 cursor-pointer hover:bg-black/5 select-none ${open ? "justify-end pr-5" : "justify-center"}`}
                    onClick={() => setOpen(!open)}
                >
                    {open ? (
                        <LuChevronLeft className="w-8 h-8 text-[#2f3e36]" />
                    ) : (
                        <LuChevronRight className="w-8 h-8 text-[#2f3e36]" />
                    )}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* MENSAJES */}
                    <div
                        onClick={() => route("/messages")}
                        className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}
                    >
                        <LuBraces className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />

                        {open && (
                            <span className="text-[#2f3e36] whitespace-nowrap">
                                Mensajes
                            </span>
                        )}
                    </div>

                    {/* HISTORIAL */}
                    <div
                        onClick={() => route("/history")}
                        className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}
                    >
                        <LuHistory className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />

                        {open && (
                            <span className="text-[#2f3e36] whitespace-nowrap">
                                Historial
                            </span>
                        )}
                    </div>

                    {/* AGENTES */}
                    <div
                        onClick={() => route("/agents")}
                        className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}
                    >
                        <LuListTodo className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />

                        {open && (
                            <span className="text-[#2f3e36] whitespace-nowrap">
                                Agentes
                            </span>
                        )}
                    </div>

                    {/* AUTO-RESPUESTAS (solo si algún agente tiene keyword) */}
                    {showKeywords && (
                        <div
                            onClick={() => route("/auto-replies")}
                            className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}
                        >
                            <LuMessageSquare className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />

                            {open && (
                                <span className="text-[#2f3e36] whitespace-nowrap">
                                    Auto-Respuestas
                                </span>
                            )}
                        </div>
                    )}

                    {/* CONFIGURACIÓN */}
                    <div
                        onClick={() => route("/config")}
                        className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}
                    >
                        <LuSettings className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />

                        {open && (
                            <span className="text-[#2f3e36] whitespace-nowrap">
                                Configuración
                            </span>
                        )}
                    </div>

                    {/* CONTACTOS */}
                    <div
                        onClick={() => route("/contacts")}
                        className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}
                    >
                        <LuUsers className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />

                        {open && (
                            <span className="text-[#2f3e36] whitespace-nowrap">
                                Contactos
                            </span>
                        )}
                    </div>

                    {/* BASE DE CONOCIMIENTO (solo si algún agente tiene pln) */}
                    {showKnowledge && (
                        <div
                            onClick={() => route("/knowledge")}
                            className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}
                        >
                            <LuBrain className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />

                            {open && (
                                <span className="text-[#2f3e36] whitespace-nowrap">
                                    Conocimiento
                                </span>
                            )}
                        </div>
                    )}

                    {/* DESARROLLADOR (solo si algún agente tiene developer) */}
                    {showDeveloper && (
                        <div
                            onClick={() => route("/developer")}
                            className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 ${open ? "p-6" : "justify-center p-4"}`}
                        >
                            <LuCode className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />

                            {open && (
                                <span className="text-[#2f3e36] whitespace-nowrap">
                                    Desarrollador
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* USUARIO - FOTO + NOMBRE */}
                <div className="relative mt-auto">
                    {showUserMenu && open && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 bg-[#3D4A3E] rounded-2xl shadow-xl mb-3 min-w-[180px]">
                                <div className="px-5 pt-4 pb-2 text-center border-b border-white/10">
                                    <span className="text-[#d9d9d9] text-sm font-medium">
                                        {user?.username || user?.email}
                                    </span>
                                </div>
                                <div
                                    onClick={() => { setShowUserMenu(false); route("/profile") }}
                                    className="px-5 py-3 text-[#d9d9d9] text-sm cursor-pointer hover:bg-black/10 transition-colors"
                                >
                                    Perfil
                                </div>
                                <div
                                    onClick={handleLogout}
                                    className="px-5 py-3 text-[#d9d9d9] text-sm cursor-pointer hover:bg-black/10 transition-colors rounded-b-2xl"
                                >
                                    Cerrar sesión
                                </div>
                            </div>
                        </>
                    )}

                    <div
                        onClick={() => open && setShowUserMenu(!showUserMenu)}
                        className={`flex items-center gap-3 bg-[var(--color-back)] m-4 rounded-xl shadow-sm cursor-pointer transition-colors ${open ? "h-14 px-3 hover:bg-[#d0d0d0]" : "h-12 w-12 justify-center"}`}
                    >
                        {avatarUri && (
                            <img
                                src={avatarUri}
                                alt="avatar"
                                className="w-8 h-8 rounded-full min-w-[32px]"
                            />
                        )}
                        {open && (
                            <span className="text-[#2f3e36] text-sm truncate">
                                {user?.username || user?.email}
                            </span>
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}
