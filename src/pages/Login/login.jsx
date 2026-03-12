import { useState } from "react"
import { loginUser } from "../../services/auth"

export function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // const token = localStorage.getItem("token")

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await loginUser(email, password)
            localStorage.setItem("token", response.token)
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-[var(--color-alt)]">
            <input
                type="text"
                className="m-5 rounded-[20px] w-[260px] h-[50px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="m-5 rounded-[20px] w-[260px] h-[50px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                className="m-5 rounded-[20px] w-[260px] h-[50px] border-none bg-[var(--color-accent)] text-[var(--color-font)] text-base font-medium cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleLogin}
            >
                Iniciar
            </button>
        </div>
    )
}
