import { useLocation } from "preact-iso";

export function NotFound() {
	const { route } = useLocation();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#D1D5D2] gap-6 px-4">
			<h1 className="text-8xl font-light text-[#2f3e36] tracking-widest">
				404
			</h1>
			<p className="text-lg text-[#2f3e36]/60 font-light">
				Página no encontrada
			</p>
			<button
				onClick={() => route("/")}
				className="mt-4 bg-[#3D4A3E] text-[#A18E6E] px-10 py-3 rounded-full uppercase tracking-widest text-sm font-bold shadow-lg hover:bg-[#2f3a30] transition-colors"
			>
				Volver al inicio
			</button>
		</div>
	);
}
