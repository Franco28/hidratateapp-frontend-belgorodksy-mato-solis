import { createContext, useContext, useEffect, useState } from "react";
import { CLAVE_DATOS, CLAVE_SESION, datosIniciales } from "../datos/datosIniciales.js";
import { fechaLocal, totalDelDia, validarCantidad, validarMeta, validarNombre } from "../utilidades/funciones.js";

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
  const [idSesion, setIdSesion] = useState(() => sessionStorage.getItem(CLAVE_SESION));
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

  function guardarConfiguracion(nombre, meta) {
    if (!usuarioActual) throw new Error("Tenés que iniciar sesión.");
    const nombreValido = validarNombre(nombre);
    const metaValida = validarMeta(Number(meta));
    setDatos((anterior) => ({
      ...anterior,
      usuarios: anterior.usuarios.map((item) =>
        item.id === usuarioActual.id
          ? { ...item, nombre: nombreValido, meta: metaValida }
          : item,
      ),
    }));
    setAviso("Guardaste la configuración.");
  }

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

  function agregarConsumo(cantidad) {
    if (!usuarioActual) throw new Error("Tenés que iniciar sesión.");
    validarCantidad(cantidad);

    const totalAnterior = totalDelDia(
      datos.consumos,
      usuarioActual.id,
      fechaLocal(),
    );
    const nuevoConsumo = {
      id: crypto.randomUUID(),
      idUsuario: usuarioActual.id,
      cantidad,
      fecha: new Date().toISOString(),
    };

    setDatos((anterior) => ({
      ...anterior,
      consumos: [nuevoConsumo, ...anterior.consumos],
    }));

    if (
      totalAnterior < usuarioActual.meta &&
      totalAnterior + cantidad >= usuarioActual.meta
    ) {
      setAviso("¡Llegaste a tu meta de hoy!");
    } else {
      setAviso(`Agregaste ${cantidad} ml.`);
    }
  }

  function eliminarConsumo(id) {
    const consumo = datos.consumos.find((item) => item.id === id);
    if (!usuarioActual || !consumo || consumo.idUsuario !== usuarioActual.id) {
      throw new Error("No se encontró el consumo.");
    }
    setDatos((anterior) => ({
      ...anterior,
      consumos: anterior.consumos.filter((item) => item.id !== id),
    }));
    setAviso("Eliminaste un consumo.");
  }

  return (
    <ContextoAplicacion.Provider
      value={{
        datos,
        usuarioActual,
        ingresar,
        salir,
        agregarConsumo,
        eliminarConsumo,
        guardarConfiguracion,
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
