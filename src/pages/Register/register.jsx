import { useState } from "react"
import { useLocation } from 'preact-iso';

export function Register() {
    const { route } = useLocation()

    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [nombre, setNombre] = useState("")
    const [ci, setCi] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleRegister = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden")
            return
        }
        const data = { email, telefono, nombre, ci, password }
        route("/login")
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-[var(--color-alt)] font-light">
            
            {/* Título superior */}
            <h1 className="text-4xl mb-12 tracking-[0.2em] text-[var(--color-accent)] uppercase">
                Crear Usuario
            </h1>

            <form onSubmit={handleRegister} className="flex flex-col items-center">
                {/* Grid de 2 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    
                    <input
                        type="text"
                        placeholder="username"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="rounded-[20px] w-[280px] h-[45px] border-none bg-[var(--color-back)] pl-6 text-sm outline-none placeholder:text-gray-400"
                    />

                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-[20px] w-[280px] h-[45px] border-none bg-[var(--color-back)] pl-6 text-sm outline-none placeholder:text-gray-400"
                    />

                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-[20px] w-[280px] h-[45px] border-none bg-[var(--color-back)] pl-6 text-sm outline-none placeholder:text-gray-400"
                    />

                    <input
                        type="password"
                        placeholder="repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="rounded-[20px] w-[280px] h-[45px] border-none bg-[var(--color-back)] pl-6 text-sm outline-none placeholder:text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="phone"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="rounded-[20px] w-[280px] h-[45px] border-none bg-[var(--color-back)] pl-6 text-sm outline-none placeholder:text-gray-400"
                    />

                    {/* Botón alineado a la derecha en la última fila del grid */}
                    <button
                        type="submit"
                        className="rounded-[20px] w-[280px] h-[50px] border-none bg-[var(--color-accent)] text-[var(--color-font)] text-sm font-medium cursor-pointer uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        Create
                    </button>
                </div>

                <p 
                    className="mt-4 text-sm text-[var(--color-accent)] cursor-pointer hover:underline"
                    onClick={() => route("/login")}
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </p>

                {/* Texto inferior */}
                <p className="mt-6 text-xs text-[var(--color-accent)] cursor-pointer hover:underline">
                    Términos y condiciones
                </p>
            </form>
        </div>
    )
}
