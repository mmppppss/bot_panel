import { useState, useEffect, useRef } from "react"
import { LuPaperclip, LuSendHorizontal } from "react-icons/lu"
import { getAgents, sendMessage } from "../../services/agents"

export function Messages() {

    const [message, setMessage] = useState("")
    const [phone, setPhone] = useState("")
    const [agents, setAgents] = useState([])
    const [selectedAgent, setSelectedAgent] = useState("")

    const [messages, setMessages] = useState([
        {
            type: "sent",
            text: "Bienvenido al panel"
        }
    ])

    const fileInputRef = useRef(null)

    useEffect(() => {
        getAgents()
            .then((res) => setAgents(res.data || []))
            .catch((err) => console.error("Error al cargar agentes:", err))
    }, [])

    const handleSend = async () => {

        if (message.trim() === "" || phone.trim() === "" || !selectedAgent) return

        setMessages([
            ...messages,
            {
                type: "sent",
                text: message
            }
        ])

        try {
            await sendMessage(selectedAgent, phone, message)
        } catch (error) {
            console.error(error)
        }

        setMessage("")
    }

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }

    }

    return (

        <div className="h-screen w-[calc(100vw-80px)] bg-[#D1D5D2] ml-[80px] flex overflow-hidden">

            {/* CHAT PRINCIPAL */}
            <div className="flex-1 flex flex-col">

                {/* BARRA SUPERIOR: AGENTE Y TELÉFONO */}
                <div className="px-7 pt-4 pb-2 flex gap-3 items-center">
                    <select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="bg-[#E0E4DF] rounded-3xl px-4 py-2 text-sm outline-none text-[#2f3e36]"
                    >
                        <option value="">Seleccionar agente</option>
                        {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Número de teléfono"
                        className="flex-1 bg-[#E0E4DF] rounded-3xl px-4 py-2 outline-none text-[#2f3e36] text-sm"
                    />
                </div>

                {/* ÁREA MENSAJES */}
                <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-5">

                    {messages.map((msg, index) => (

                        <div
                            key={index}
                            className={`max-w-[65%] px-5 py-4 rounded-3xl text-sm shadow-sm
                            
                            ${msg.type === "sent"
                                    ? "self-end bg-[#3D4A3E] text-[#d9d9d9]"
                                    : "self-start bg-[#B4BCB4] text-[#2f3e36]"
                                }`}
                        >
                            {msg.text}
                        </div>

                    ))}

                </div>

                {/* BARRA INFERIOR */}
                <div className="p-4">

                    <div className="w-full bg-[#B4BCB4] rounded-[28px] px-4 py-2 flex items-end gap-3 shadow-sm">

                        {/* CLIP */}
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="min-w-[52px] h-[52px] rounded-full bg-[#D1D5D2] flex items-center justify-center hover:opacity-80 transition-opacity"
                        >
                            <LuPaperclip className="w-5 h-5 text-[#3D4A3E]" />
                        </button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                        />

                        {/* INPUT */}
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 min-h-[48px] max-h-[140px] bg-[#E0E4DF] rounded-3xl px-5 py-3 outline-none resize-none text-[#2f3e36] text-sm"
                        />

                        {/* ENVIAR */}
                        <button
                            onClick={handleSend}
                            className="min-w-[52px] h-[52px] rounded-full bg-[#3D4A3E] flex items-center justify-center hover:opacity-90 transition-opacity"
                        >
                            <LuSendHorizontal className="w-5 h-5 text-[#A18E6E]" />
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}