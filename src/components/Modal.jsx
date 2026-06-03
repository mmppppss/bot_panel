export function Modal({ open, title, children, onClose }) {
	if (!open) return null;

	return (
		<>
			<div
				className="fixed inset-0 bg-black/30 z-50"
				onClick={onClose}
			/>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="bg-[#DCE1DB] rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
					{title && (
						<div className="px-6 pt-6 pb-2">
							<h3 className="text-lg font-medium text-[#2f3e36] text-left">
								{title}
							</h3>
						</div>
					)}
					<div className="px-6 py-4">
						{children}
					</div>
				</div>
			</div>
		</>
	);
}
