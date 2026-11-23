import { useState } from "react";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";
import { confirmarEliminacion, mostrarError } from "../utilidades/notificaciones.js";

const formularioVacio = {
  nombre: "",
  correo: "",
  contrasena: "",
  rol: "usuario",
  activo: true,
};

export function Usuarios() {
  const {
    datos,
    usuarioActual,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario,
  } = usarAplicacion();
  const [busqueda, setBusqueda] = useState("");
  const [formulario, setFormulario] = useState({ ...formularioVacio });
  const [idEdicion, setIdEdicion] = useState(null);
  const [formularioVisible, setFormularioVisible] = useState(false);

  const usuariosFiltrados = datos.usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase()),
  );

  function cambiarCampo(campo, valor) {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  }

  function cerrarFormulario() {
    setFormulario({ ...formularioVacio });
    setIdEdicion(null);
    setFormularioVisible(false);
  }

  function nuevoUsuario() {
    cerrarFormulario();
    setFormularioVisible(true);
  }

  function editarUsuario(usuario) {
    setFormulario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contrasena: "",
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setIdEdicion(usuario.id);
    setFormularioVisible(true);
  }

  function guardarUsuario(evento) {
    evento.preventDefault();
    try {
      if (idEdicion) {
        modificarUsuario(idEdicion, formulario);
      } else {
        crearUsuario(formulario);
      }
      cerrarFormulario();
    } catch (problema) {
      mostrarError(problema.message);
    }
  }

  async function quitarUsuario(usuario) {
    const confirmado = await confirmarEliminacion(
      `Se eliminará a ${usuario.nombre} y todos sus consumos.`,
    );
    if (!confirmado) return;
    try {
      eliminarUsuario(usuario.id);
    } catch (problema) {
      mostrarError(problema.message);
    }
  }

  return (
    <div>
      <div className="encabezado-pagina encabezado-con-boton">
        <div>
          <span className="etiqueta">ADMINISTRACIÓN</span>
          <h1>Usuarios</h1>
          <p>Creá, editá o eliminá las cuentas de la aplicación.</p>
        </div>
        <button
          type="button"
          className="boton-principal"
          onClick={nuevoUsuario}
        >
          Nuevo usuario
        </button>
      </div>

      {formularioVisible && (
        <section className="tarjeta espacio-inferior">
          <h2>{idEdicion ? "Editar usuario" : "Crear usuario"}</h2>
          <p>
            {idEdicion
              ? "Dejá la contraseña vacía para mantener la actual."
              : "Completá los datos del nuevo usuario."}
          </p>
          <form className="formulario-usuarios" onSubmit={guardarUsuario}>
            <div className="campo">
              <label htmlFor="nombre-usuario">Nombre</label>
              <input
                id="nombre-usuario"
                value={formulario.nombre}
                onChange={(evento) =>
                  cambiarCampo("nombre", evento.target.value)
                }
                minLength="2"
                maxLength="60"
                required
              />
            </div>
            <div className="campo">
              <label htmlFor="correo-usuario">Correo</label>
              <input
                id="correo-usuario"
                type="email"
                value={formulario.correo}
                onChange={(evento) =>
                  cambiarCampo("correo", evento.target.value)
                }
                required
              />
            </div>
            <div className="campo">
              <label htmlFor="clave-usuario">Contraseña</label>
              <input
                id="clave-usuario"
                type="password"
                autoComplete="new-password"
                value={formulario.contrasena}
                minLength="8"
                required={!idEdicion}
                onChange={(evento) =>
                  cambiarCampo("contrasena", evento.target.value)
                }
              />
            </div>
            <div className="campo">
              <label htmlFor="rol-usuario">Rol</label>
              <select
                id="rol-usuario"
                value={formulario.rol}
                disabled={idEdicion === usuarioActual.id}
                onChange={(evento) => cambiarCampo("rol", evento.target.value)}
              >
                <option value="usuario">Usuario</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            {idEdicion && (
              <label className="opcion-checkbox">
                <input
                  type="checkbox"
                  checked={formulario.activo}
                  disabled={idEdicion === usuarioActual.id}
                  onChange={(evento) =>
                    cambiarCampo("activo", evento.target.checked)
                  }
                />{" "}
                Cuenta activa
              </label>
            )}
            <div className="acciones-formulario">
              <button
                type="button"
                className="boton-secundario"
                onClick={cerrarFormulario}
              >
                Cancelar
              </button>
              <button type="submit" className="boton-principal">
                {idEdicion ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="tarjeta">
        <div className="titulo-con-busqueda">
          <div>
            <h2>Lista de usuarios</h2>
            <p>{datos.usuarios.length} cuentas registradas</p>
          </div>
          <input
            type="search"
            aria-label="Buscar usuario"
            placeholder="Buscar por nombre o correo"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </div>
        <div className="tabla-desplazable">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre y correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <strong>{usuario.nombre}</strong>
                    <small>{usuario.correo}</small>
                  </td>
                  <td>
                    {usuario.rol === "administrador"
                      ? "Administrador"
                      : "Usuario"}
                  </td>
                  <td>{usuario.activo ? "Activo" : "Inactivo"}</td>
                  <td>
                    <div className="acciones-tabla">
                      <button
                        type="button"
                        className="boton-secundario"
                        onClick={() => editarUsuario(usuario)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="boton-eliminar"
                        disabled={usuario.id === usuarioActual.id}
                        onClick={() => quitarUsuario(usuario)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuariosFiltrados.length === 0 && (
            <p className="sin-registros">
              No encontramos usuarios con esa búsqueda.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
