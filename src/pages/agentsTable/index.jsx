import { useState, useEffect } from "preact/hooks"
import { useLocation } from "preact-iso"
import { useAuth } from "../../contexts/AuthContext"
import { useRequireAuth } from "../../hooks/useRequireAuth"
import { getAgents, deleteAgent } from "../../services/agents"
import { Table, TableRow } from "../../components/Table"
import { Modal } from "../../components/Modal"
import { useNotify } from "../../components/Notify/NotifyContext"

const HEADERS = ["Nombre", "Descripción", "Acciones"]
const COLS = 3

export function AgentsTable() {

    const { loading, isAuthenticated } = useRequireAuth()
    const { user } = useAuth()
    const { route } = useLocation()
    const { notify } = useNotify()

    const [agents, setAgents] = useState([])
    const [agentsLoading, setAgentsLoading] = useState(true)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (!user?.id) return
        setAgentsLoading(true)
        getAgents(user.id)
            .then((res) => setAgents(res.data || []))
            .catch((err) => console.error("Error al cargar agentes:", err))
            .finally(() => setAgentsLoading(false))
    }, [user])

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await deleteAgent(user.id, deleteTarget.id)
            setAgents((prev) => prev.filter((a) => a.id !== deleteTarget.id))
            setDeleteTarget(null)
        } catch (err) {
            console.error("Error al eliminar agente:", err)
            notify(err.message, "error")
        } finally {
            setDeleting(false)
        }
    }

    if (loading || !isAuthenticated) return null

    if (agentsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-[#2f3e36] text-sm animate-pulse">Cargando agentes...</div>
            </div>
        )
    }

    return (

        <div className="min-h-screen flex items-start justify-center px-7 py-8">

            <div className="w-full max-w-4xl">

                {/* HEADER CON TÍTULO Y BOTÓN */}
                <div className="flex items-start justify-between mb-7">
                    <div>
                        <h1 className="text-4xl font-light text-[#2f3e36] text-left">
                            Tus agentes
                        </h1>
                        <p className="text-sm text-[#2f3e36]/60 mt-1 text-left">
                            Gestiona tus agentes creados
                        </p>
                    </div>
                    <button
                        onClick={() => route("/create")}
                        className="bg-[#3D4A3E] text-[#A18E6E] px-6 py-3 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#2f3a30] transition-colors"
                    >
                        Crear agente
                    </button>
                </div>

                {/* TABLA */}
                <Table headers={HEADERS} cols={COLS}>

                    {agents.length === 0 ? (

                        <div className="w-full h-[350px] flex items-center justify-center text-[#2f3e36]/50 text-sm tracking-wide">
                            No tienes agentes registrados
                        </div>

                    ) : (

                        agents.map((agent) => (

                            <TableRow key={agent.id} cols={COLS}>

                                <span className="text-[#2f3e36] text-left text-sm">
                                    {agent.name}
                                </span>

                                <span className="text-[#2f3e36]/60 text-left text-sm">
                                    {agent.description || "—"}
                                </span>

                                <div className="flex items-center gap-3">
                                    <span
                                        onClick={() => route(`/edit/${agent.id}`)}
                                        className="text-[#A18E6E] cursor-pointer hover:opacity-70 transition-opacity text-left text-sm"
                                    >
                                        Editar
                                    </span>
                                    <span
                                        onClick={() => setDeleteTarget(agent)}
                                        className="text-red-500 cursor-pointer hover:opacity-70 transition-opacity text-left text-sm"
                                    >
                                        Eliminar
                                    </span>
                                </div>

                            </TableRow>

                        ))

                    )}

                </Table>

            </div>

            {/* MODAL CONFIRMAR ELIMINACIÓN */}
            <Modal
                open={!!deleteTarget}
                title="Eliminar agente"
                onClose={() => !deleting && setDeleteTarget(null)}
            >
                <p className="text-sm text-[#2f3e36]/70 mb-6 text-left">
                    ¿Estás seguro de eliminar <strong>{deleteTarget?.name}</strong>? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setDeleteTarget(null)}
                        disabled={deleting}
                        className="px-5 py-2 rounded-full text-sm text-[#2f3e36] bg-[#b2b8af] hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-5 py-2 rounded-full text-sm text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {deleting ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </Modal>

        </div>
    )
}