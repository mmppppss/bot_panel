import { useState } from "react"

export function MenuButton(){

const [open, setOpen] = useState(false)

return(

<div className="fixed top-5 left-5 z-50">

  {/* BOTÓN */}
  <button
    onClick={()=>setOpen(!open)}
    className="w-[50px] h-[50px] rounded-[12px] bg-[#b2b8af] flex items-center justify-center shadow-md hover:scale-105 transition"
  >
    <span className={`text-[#2f3e36] text-xl transition-transform ${open ? "rotate-90" : ""}`}>
      ➤
    </span>
  </button>

  {/* MENÚ */}
  {open && (
    <div className="mt-3 w-[160px] bg-white rounded-[12px] shadow-md p-3 flex flex-col gap-2">

      <p className="text-sm cursor-pointer hover:text-[#a68552]">
        Inicio
      </p>

      <p className="text-sm cursor-pointer hover:text-[#a68552]">
        Perfil
      </p>

      <p className="text-sm cursor-pointer hover:text-[#a68552]">
        Cerrar sesión
      </p>

    </div>
  )}

</div>

)
}