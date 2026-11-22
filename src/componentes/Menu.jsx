import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";
import { Aviso } from "./Aviso.jsx";

export function Menu() {
  const { usuarioActual, salir, errorGuardado } = usarAplicacion();
  const navegar = useNavigate();

  function cerrarSesion() {
    salir();
    navegar("/ingreso");
  }

  return (
    <div className="aplicacion">
      <aside className="barra-lateral">
        <div className="marca">
          <img className="logo" src="/imagenes/icono.png" alt="" />
          <strong>HidratateApp</strong>
        </div>
        <p className="subtitulo-menu">REGISTRO DE AGUA</p>
        <nav className="enlaces-menu" aria-label="Menú principal">
          <NavLink end to="/" className={({ isActive }) => isActive ? "enlace-menu seleccionado" : "enlace-menu"}>
            Inicio
          </NavLink>
          <NavLink to="/historial" className={({ isActive }) => isActive ? "enlace-menu seleccionado" : "enlace-menu"}>
            Historial
          </NavLink>
          <NavLink to="/configuracion" className={({ isActive }) => isActive ? "enlace-menu seleccionado" : "enlace-menu"}>
            Configuración
          </NavLink>
        </nav>
        <div className="pie-menu">
          <strong>{usuarioActual.nombre}</strong>
          <small>{usuarioActual.rol === "administrador" ? "Administrador" : "Usuario"}</small>
          <button type="button" className="boton-salir" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </aside>
      <div className="contenido-general">
        <header className="barra-superior">
          <div className="marca marca-movil">
            <img className="logo" src="/imagenes/icono.png" alt="" />
            <strong>HidratateApp</strong>
          </div>
          <span>Hola, {usuarioActual.nombre}</span>
          <button className="boton-salir boton-salir-movil" type="button" onClick={cerrarSesion}>Salir</button>
        </header>
        <main className="contenido">
          {errorGuardado && <p className="mensaje-error" role="alert">{errorGuardado}</p>}
          <Aviso />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
