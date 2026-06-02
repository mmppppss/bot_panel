import { useState, useMemo } from "react"
import { useLocation } from 'preact-iso';
import { LuBot, LuBraces, LuListTodo, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { icon } from "profile-icon"
import { useAuth } from "../contexts/AuthContext"

export function Menu() {

    const [open, setOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { route } = useLocation();
    const { user, logout } = useAuth();

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
            {/* Overlay para cerrar el menú si haces clic fuera */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => closeOverlays()}
                />
            )}

            <div className={`flex flex-col fixed top-0 left-0 h-full bg-[#b2b8af] z-50 transition-all duration-300 ${open ? "w-64" : "w-20"}`}>

                {/* BOTÓN INTERNO PARA ABRIR/CERRAR */}
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

                {/* CREAR AGENTE */}
                <div
                    onClick={() => route("/create")}
                    className={`flex items-center gap-4 cursor-pointer hover:bg-black/5 select-none transition-colors ${open ? "p-6" : "justify-center p-4"}`}
                >
                    <LuBot className="w-6 h-6 min-w-[24px] text-[#2f3e36]" />

                    {open && (
                        <span className="text-[#2f3e36] font-medium whitespace-nowrap">
                            Crear Agente
                        </span>
                    )}
                </div>

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
