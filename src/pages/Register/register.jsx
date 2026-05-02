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

            <form onSubmit={handleRegister} className="flex flex-col items-center">

                {/* CONTENEDOR PRINCIPAL: ALINEA TODO EN FILA */}
                <div className="flex items-center gap-16">

                    {/* COLUMNA IZQUIERDA: TÍTULO + INPUTS */}
                    <div className="flex flex-col">

                        {/* TÍTULO ALINEADO A LA IZQUIERDA DE LOS INPUTS */}
                        <h1 className="text-4xl mb-8 tracking-[0.1em] text-[var(--color-accent)] uppercase text-left">
                            Crear Usuario
                        </h1>

                        {/* GRID DE INPUTS CON MÁS ESPACIO (gap-y-4) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
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

                            <button
                                type="submit"
                                className="rounded-[20px] w-[280px] h-[50px] border-none bg-[var(--color-accent)] text-[var(--color-font)] text-sm font-medium cursor-pointer uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                                Create
                            </button>
                        </div>
                    </div>

                    {/* LOGO (A la derecha de todo el bloque anterior) */}
                    <img
                        src="/logo.svg"
                        alt="Logo empresa"
                        className="w-[200px] object-contain"
                    />
                </div>

                {/* LINKS INFERIORES */}
                <div className="flex flex-col items-center mt-8">
                    <p
                        className="text-sm text-[var(--color-accent)] cursor-pointer hover:underline"
                        onClick={() => route("/login")}
                    >
                        ¿Ya tienes cuenta? Inicia sesión
                    </p>

                    <p className="mt-4 text-xs text-[var(--color-accent)] cursor-pointer hover:underline">
                        Términos y condiciones
                    </p>
                </div>

            </form>
        </div>
    )
}