import { createContext, useContext, useEffect, useState } from "react";
import { CLAVE_DATOS, CLAVE_SESION, datosIniciales, META_INICIAL } from "../datos/datosIniciales.js";
import { fechaLocal, totalDelDia, validarCantidad, validarMeta, validarNombre, validarContrasena, validarCorreo } from "../utilidades/funciones.js";

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

  function guardarConfiguracion(nombre, meta, recordatorios, minutos) {
    if (!usuarioActual) throw new Error("Tenés que iniciar sesión.");
    const nombreValido = validarNombre(nombre);
    const metaValida = validarMeta(Number(meta));
    const minutosValidos = Number(minutos);
    if (![30, 60, 120].includes(minutosValidos)) {
      throw new Error("Seleccioná una frecuencia válida.");
    }

    setDatos((anterior) => ({
      ...anterior,
      usuarios: anterior.usuarios.map((item) =>
        item.id === usuarioActual.id
          ? {
              ...item,
              nombre: nombreValido,
              meta: metaValida,
              recordatorios,
              minutosRecordatorio: minutosValidos,
            }
          : item,
      ),
    }));
    setAviso("Guardaste la configuración.");
  }

  function verificarAdministrador() {
    if (usuarioActual?.rol !== "administrador") {
      throw new Error("Esta opción es solo para administradores.");
    }
  }

  function validarUsuario(nombre, correo, rol) {
    const nombreValido = validarNombre(nombre);
    const correoValido = validarCorreo(correo);
    if (rol !== "usuario" && rol !== "administrador") {
      throw new Error("Seleccioná un rol válido.");
    }
    return { nombre: nombreValido, correo: correoValido, rol };
  }

  function crearUsuario(formulario) {
    verificarAdministrador();
    const usuarioValidado = validarUsuario(
      formulario.nombre,
      formulario.correo,
      formulario.rol,
    );
    validarContrasena(formulario.contrasena);
    if (datos.usuarios.some((item) => item.correo === usuarioValidado.correo)) {
      throw new Error("Ya existe un usuario con ese correo.");
    }

    const nuevoUsuario = {
      id: crypto.randomUUID(),
      ...usuarioValidado,
      contrasena: formulario.contrasena,
      activo: true,
      meta: META_INICIAL,
      recordatorios: false,
      minutosRecordatorio: 60,
    };
    setDatos((anterior) => ({
      ...anterior,
      usuarios: [...anterior.usuarios, nuevoUsuario],
    }));
    setAviso("Creaste un usuario.");
  }

  function modificarUsuario(id, formulario) {
    verificarAdministrador();
    const usuario = datos.usuarios.find((item) => item.id === id);
    if (!usuario) throw new Error("No se encontró el usuario.");

    const usuarioValidado = validarUsuario(
      formulario.nombre,
      formulario.correo,
      formulario.rol,
    );
    if (
      datos.usuarios.some(
        (item) => item.id !== id && item.correo === usuarioValidado.correo,
      )
    ) {
      throw new Error("Ese correo ya está registrado.");
    }
    if (
      id === usuarioActual.id &&
      (!formulario.activo || formulario.rol !== "administrador")
    ) {
      throw new Error(
        "No podés desactivar tu cuenta ni cambiar tu propio rol.",
      );
    }

    const administradores = datos.usuarios.filter(
      (item) => item.rol === "administrador" && item.activo,
    );
    if (
      usuario.rol === "administrador" &&
      usuario.activo &&
      administradores.length === 1 &&
      (formulario.rol !== "administrador" || !formulario.activo)
    ) {
      throw new Error("Debe quedar al menos un administrador activo.");
    }

    let contrasena = usuario.contrasena;
    if (formulario.contrasena !== "") {
      contrasena = validarContrasena(formulario.contrasena);
    }

    setDatos((anterior) => ({
      ...anterior,
      usuarios: anterior.usuarios.map((item) =>
        item.id === id
          ? {
              ...item,
              ...usuarioValidado,
              contrasena,
              activo: formulario.activo,
            }
          : item,
      ),
    }));
    setAviso("Actualizaste el usuario.");
  }

  function eliminarUsuario(id) {
    verificarAdministrador();
    if (id === usuarioActual.id)
      throw new Error("No podés eliminar tu propia cuenta.");
    const usuario = datos.usuarios.find((item) => item.id === id);
    if (!usuario) throw new Error("No se encontró el usuario.");

    const administradores = datos.usuarios.filter(
      (item) => item.rol === "administrador" && item.activo,
    );
    if (
      usuario.rol === "administrador" &&
      usuario.activo &&
      administradores.length === 1
    ) {
      throw new Error("Debe quedar al menos un administrador activo.");
    }
    setDatos((anterior) => ({
      usuarios: anterior.usuarios.filter((item) => item.id !== id),
      consumos: anterior.consumos.filter((item) => item.idUsuario !== id),
    }));
    setAviso("Eliminaste el usuario y sus registros.");
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
        crearUsuario,
        modificarUsuario,
        eliminarUsuario,
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
