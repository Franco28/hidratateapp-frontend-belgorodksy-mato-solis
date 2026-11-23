import { useEffect } from "react";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";
import { mostrarToast } from "../utilidades/notificaciones.js";

export function Aviso() {
  const { aviso, setAviso } = usarAplicacion();

  useEffect(() => {
    if (!aviso) return;
    mostrarToast(aviso);
    const tiempo = setTimeout(() => setAviso(""), 4000);
    return () => clearTimeout(tiempo);
  }, [aviso, setAviso]);

  return null;
}
