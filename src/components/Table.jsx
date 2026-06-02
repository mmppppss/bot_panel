export function Table({ headers, cols, children, className = "" }) {
	return (
		<div className={`w-full bg-[#B4BCB4] rounded-[30px] overflow-hidden shadow-sm ${className}`}>
			<div
				className="px-8 py-4 bg-[#3D4A3E]"
				style={{ display: "grid", gridTemplateColumns: `repeat(${cols || headers.length}, 1fr)` }}
			>
				{headers.map((h, i) => (
					<span key={i} className="text-[#d9d9d9] text-sm uppercase tracking-widest text-left">
						{h}
					</span>
				))}
			</div>
			<div className="bg-[#DCE1DB]">
				{children}
			</div>
		</div>
	);
}

export function TableRow({ children, cols, className = "" }) {
	return (
		<div
			className={`items-center px-8 py-4 border-b border-[#b2b8af] last:border-b-0 ${className}`}
			style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}
		>
			{children}
		</div>
	);
}
