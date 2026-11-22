import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";

export function Ingreso() {
  const { usuarioActual, ingresar } = usarAplicacion();
  const navegar = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  if (usuarioActual) return <Navigate to="/" replace />;

  function iniciarSesion(evento) {
    evento.preventDefault();
    if (ingresar(correo, contrasena)) {
      navegar("/");
    } else {
      setError("Correo o contraseña incorrectos, o cuenta desactivada.");
    }
  }

  function elegirCuenta(tipo) {
    if (tipo === "administrador") {
      setCorreo("admin@hidratate.app");
      setContrasena("Admin123!");
    } else {
      setCorreo("usuario@hidratate.app");
      setContrasena("Usuario123!");
    }
    setError("");
  }

  return (
    <div className="pantalla-ingreso">
      <section className="presentacion-ingreso">
        <span className="marca-ingreso">HidratateApp</span>
        <div className="ilustracion-ingreso">
          <img src="/imagenes/icono.png" alt="" />
        </div>
        <h1>Registrá el agua que tomás cada día.</h1>
        <p>
          Llevá el control de tus consumos, consultá el historial y configurá
          una meta.
        </p>
      </section>
      <section className="sector-ingreso">
        <div className="tarjeta-ingreso">
          <h2>Iniciar sesión</h2>
          <p>Ingresá con tu cuenta para ver tus registros.</p>
          <form onSubmit={iniciarSesion} className="formulario-vertical">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              value={correo}
              autoComplete="username"
              onChange={(evento) => setCorreo(evento.target.value)}
              required
            />
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              autoComplete="current-password"
              onChange={(evento) => setContrasena(evento.target.value)}
              required
            />
            {error && (
              <p className="mensaje-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="boton-principal">
              Ingresar
            </button>
          </form>
          <div className="cuentas-prueba">
            <strong>Cuentas para probar el trabajo</strong>
            <button type="button" onClick={() => elegirCuenta("administrador")}>
              Usar administrador
            </button>
            <button type="button" onClick={() => elegirCuenta("usuario")}>
              Usar usuario común
            </button>
            <small>
              Las cuentas son de ejemplo. No ingreses contraseñas personales.
            </small>
          </div>
        </div>
      </section>
    </div>
  );
}
