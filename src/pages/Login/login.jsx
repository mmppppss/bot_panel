import { useState } from "react"
import { useLocation } from 'preact-iso';
import { loginUser } from "../../services/auth"
import { useNotify } from "../../components/Notify/NotifyContext"

export function Login() {

	const { route } = useLocation()
	const { notify } = useNotify()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)

	const handleLogin = async (e) => {
		e.preventDefault()

		try {

			const response = await loginUser(email, password)

			if (!response?.data?.token) {
				throw new Error(response?.message || "Login fallido")
			}

			console.log(response?.data)

			localStorage.setItem("token", response.data.token)

			route("/")

		} catch (error) {

			notify(error.message, "error")

		}
	}

	return (

		<div className="flex flex-col items-center justify-center w-full h-screen bg-[var(--color-alt)]">

			{/* LOGO */}
			<img
				src="/logo.svg"
				alt="Logo empresa"
				className="w-[140px] object-contain mb-10"
			/>

			{/* EMAIL */}
			<input
				type="text"
				className="m-3 rounded-[20px] w-[260px] h-[50px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
				placeholder="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			{/* PASSWORD */}
			<div className="relative">

				<input
					type={showPassword ? "text" : "password"}
					className="m-3 rounded-[20px] w-[260px] h-[50px] border-none bg-[var(--color-back)] pl-5 text-sm font-light outline-none"
					placeholder="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<span
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer text-[#2f3e36]"
				>
					👁
				</span>

			</div>

			{/* BOTÓN */}
			<button
				className="m-3 rounded-[20px] w-[260px] h-[50px] border-none bg-[var(--color-accent)] text-[var(--color-font)] text-base font-medium cursor-pointer hover:opacity-90 transition-opacity"
				onClick={handleLogin}
			>
				INICIAR
			</button>

			{/* CREAR CUENTA */}
			<p
				className="text-sm text-[var(--color-accent)] cursor-pointer hover:underline"
				onClick={() => route("/register")}
			>
				Crear cuenta
			</p>

		</div>
	)
}