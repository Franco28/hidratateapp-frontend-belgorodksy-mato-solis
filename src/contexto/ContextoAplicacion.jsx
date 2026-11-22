import { createContext, useContext, useEffect, useState } from "react";
import {
  CLAVE_DATOS,
  CLAVE_SESION,
  datosIniciales,
} from "../datos/datosIniciales.js";

const ContextoAplicacion = createContext(null);

function cargarDatos() {
  const guardado = localStorage.getItem(CLAVE_DATOS);
  if (!guardado) return datosIniciales;

  try {
    const datos = JSON.parse(guardado);
    if (Array.isArray(datos.usuarios) && Array.isArray(datos.consumos)) {
      return datos;
    }
  } catch (error) {
    console.warn("No se pudieron leer los datos guardados.", error);
  }
  return datosIniciales;
}

export function ProveedorAplicacion({ children }) {
  const [datos, setDatos] = useState(cargarDatos);
  const [idSesion, setIdSesion] = useState(() =>
    sessionStorage.getItem(CLAVE_SESION),
  );
  const [aviso, setAviso] = useState("");
  const [errorGuardado, setErrorGuardado] = useState("");

  const usuarioActual = datos.usuarios.find(
    (usuario) => usuario.id === idSesion && usuario.activo,
  );

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_DATOS, JSON.stringify(datos));
      setErrorGuardado("");
    } catch {
      setErrorGuardado("No se pudieron guardar los datos en este navegador.");
    }
  }, [datos]);

  useEffect(() => {
    if (usuarioActual) {
      sessionStorage.setItem(CLAVE_SESION, usuarioActual.id);
    } else {
      sessionStorage.removeItem(CLAVE_SESION);
    }
  }, [usuarioActual]);

  function ingresar(correo, contrasena) {
    const usuario = datos.usuarios.find(
      (item) =>
        item.correo === correo.trim().toLowerCase() &&
        item.contrasena === contrasena &&
        item.activo,
    );

    if (!usuario) return false;
    setIdSesion(usuario.id);
    return true;
  }

  function salir() {
    setIdSesion(null);
    setAviso("");
  }

  return (
    <ContextoAplicacion.Provider
      value={{
        datos,
        usuarioActual,
        ingresar,
        salir,
        aviso,
        setAviso,
        errorGuardado,
      }}
    >
      {children}
    </ContextoAplicacion.Provider>
  );
}

export function usarAplicacion() {
  const contexto = useContext(ContextoAplicacion);
  if (!contexto) throw new Error("Falta el proveedor de la aplicación.");
  return contexto;
}
