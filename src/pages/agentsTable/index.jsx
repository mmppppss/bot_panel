import { useLocation } from "preact-iso"

export function AgentsTable() {

    const { route } = useLocation()

    const agents = []

    return (

        <div className="min-h-screen w-[calc(100vw-80px)] bg-[#D1D5D2] ml-[80px] flex overflow-hidden">

            <div className="flex-1 flex flex-col px-7 py-6">

                {/* CONTENEDOR */}
                <div className="w-full max-w-5xl">

                    {/* TÍTULO */}
                    <div className="mb-7">

                        <h1 className="text-4xl font-light text-[#2f3e36] text-left">
                            Tus agentes
                        </h1>

                        <p className="text-sm text-[#2f3e36]/60 mt-1 text-left">
                            Gestiona tus agentes creados
                        </p>

                    </div>

                    {/* TABLA */}
                    <div className="w-full bg-[#B4BCB4] rounded-[30px] overflow-hidden shadow-sm">

                        {/* HEADER */}
                        <div className="grid grid-cols-4 px-8 py-4 bg-[#3D4A3E]">

                            <span className="text-[#d9d9d9] text-sm uppercase tracking-widest text-left">
                                Nombre
                            </span>

                            <span className="text-[#d9d9d9] text-sm uppercase tracking-widest text-left">
                                Estado
                            </span>

                            <span className="text-[#d9d9d9] text-sm uppercase tracking-widest text-left">
                                Canal
                            </span>

                            <span className="text-[#d9d9d9] text-sm uppercase tracking-widest text-left">
                                Acciones
                            </span>

                        </div>

                        {/* CONTENIDO */}
                        <div className="bg-[#DCE1DB] min-h-[350px]">

                            {agents.length === 0 ? (

                                <div className="w-full h-[350px] flex items-center justify-center text-[#2f3e36]/50 text-sm tracking-wide">
                                    No tienes agentes registrados
                                </div>

                            ) : (

                                agents.map((agent) => (

                                    <div
                                        key={agent.id}
                                        className="grid grid-cols-4 items-center px-8 py-4 border-b border-[#b2b8af]"
                                    >

                                        {/* NOMBRE */}
                                        <span className="text-[#2f3e36] text-left">
                                            {agent.name}
                                        </span>

                                        {/* ESTADO */}
                                        <span className="text-[#2f3e36] text-left">
                                            {agent.status ? "Activo" : "Apagado"}
                                        </span>

                                        {/* CANAL */}
                                        <span className="text-[#2f3e36] text-left">
                                            {agent.platform}
                                        </span>

                                        {/* ACCIONES */}
                                        <span
                                            onClick={() => route(`/edit/${agent.id}`)}
                                            className="text-[#A18E6E] cursor-pointer hover:opacity-70 transition-opacity text-left"
                                        >
                                            Editar
                                        </span>

                                    </div>

                                ))

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}