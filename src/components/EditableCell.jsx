import { useState, useEffect, useRef } from "preact/hooks";

export function EditableCell({ value, onSave }) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value);
	const ref = useRef(null);

	useEffect(() => {
		setDraft(value);
	}, [value]);

	const commit = () => {
		setEditing(false);
		if (draft !== value) {
			onSave(draft);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") commit();
		if (e.key === "Escape") {
			setDraft(value);
			setEditing(false);
		}
	};

	if (editing) {
		return (
			<input
				ref={ref}
				value={draft}
				onInput={(e) => setDraft(e.target.value)}
				onBlur={commit}
				onKeyDown={handleKeyDown}
				autoFocus
				className="w-full bg-[#e0e4df] rounded-lg px-2 py-1 text-sm outline-none border border-[#A18E6E]"
			/>
		);
	}

	return (
		<span
			className="text-sm text-[#2f3e36] cursor-pointer hover:bg-[#d9d9d9] rounded px-1 -ml-1 transition-colors min-h-[24px] block"
			onClick={() => setEditing(true)}
		>
			{String(value ?? "") || <span className="text-[#b2b8af] italic">Vacío</span>}
		</span>
	);
}
