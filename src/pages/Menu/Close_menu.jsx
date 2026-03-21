import { useState } from "react"

export function Menu(){

const [open, setOpen] = useState(false)

return(

<>
{/* BOTÓN */}
<div className="fixed top-5 left-5 z-50">

  <button
    onClick={()=>setOpen(!open)}
    className="w-[50px] h-[50px] rounded-[12px] bg-[#b2b8af] flex items-center justify-center shadow-md"
  >
    <span className={`text-[#2f3e36] text-xl transition-transform ${open ? "rotate-90" : ""}`}>
      &gt;
    </span>
  </button>

</div>

{/* FONDO OSCURECIDO */}
{open && (
  <div 
    className="fixed inset-0 bg-black/20 z-40"
    onClick={()=>setOpen(false)}
  />
)}

{/* MENÚ LATERAL */}
<div className={`fixed top-0 left-0 h-full w-[220px] bg-[#b2b8af] z-50 transform transition-transform duration-300
${open ? "translate-x-0" : "-translate-x-full"}`}>

  <div className="mt-20 flex flex-col items-start pl-6 gap-6">

    <p className="text-[#2f3e36] cursor-pointer hover:text-[#a68552]">
      Inicio
    </p>

    <p className="text-[#2f3e36] cursor-pointer hover:text-[#a68552]">
      Perfil
    </p>

    <p className="text-[#2f3e36] cursor-pointer hover:text-[#a68552]">
      Configuración
    </p>

    <p className="text-[#2f3e36] cursor-pointer hover:text-[#a68552]">
      Cerrar sesión
    </p>

  </div>

</div>

</>

)
}