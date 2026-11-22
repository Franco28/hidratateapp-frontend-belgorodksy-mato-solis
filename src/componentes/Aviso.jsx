import { useEffect } from "react";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";

export function Aviso() {
  const { aviso, setAviso } = usarAplicacion();

  useEffect(() => {
    if (!aviso) return;
    const tiempo = setTimeout(() => setAviso(""), 4000);
    return () => clearTimeout(tiempo);
  }, [aviso, setAviso]);

  if (!aviso) return null;

  return (
    <div className="aviso" role="status">
      <span>{aviso}</span>
      <button
        type="button"
        onClick={() => setAviso("")}
        aria-label="Cerrar aviso"
      >
        ×
      </button>
    </div>
  );
}
