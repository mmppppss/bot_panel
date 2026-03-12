import { useState } from "react"

export function Register() {

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

        const data = {
            email,
            telefono,
            nombre,
            ci,
            password
        }

        console.log(data)
    }

    return (

        <div className="flex flex-col items-center justify-center w-full h-screen bg-[var(--color-alt)]">

            <input
                type="text"
                placeholder="Nombre del propietario"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="m-2 rounded-[20px] w-[260px] h-[45px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
            />

            <input
                type="text"
                placeholder="CI"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                className="m-2 rounded-[20px] w-[260px] h-[45px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="m-2 rounded-[20px] w-[260px] h-[45px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
            />

            <input
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="m-2 rounded-[20px] w-[260px] h-[45px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
            />

            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="m-2 rounded-[20px] w-[260px] h-[45px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
            />

            <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="m-2 rounded-[20px] w-[260px] h-[45px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
            />

            <button
                onClick={handleRegister}
                className="m-4 rounded-[20px] w-[260px] h-[50px] border-none bg-[var(--color-accent)] text-[var(--color-font)] text-base font-medium cursor-pointer"
            >
                Crear cuenta
            </button>

        </div>

    )
}