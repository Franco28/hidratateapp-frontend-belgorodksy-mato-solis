import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";

export function Inicio() {
  const { usuarioActual } = usarAplicacion();
  return (
    <div>
      <div className="encabezado-pagina">
        <div>
          <span className="etiqueta">MI CUENTA</span>
          <h1>Hola, {usuarioActual.nombre.split(" ")[0]}</h1>
          <p>Bienvenido a HidratateApp.</p>
        </div>
      </div>
      <section className="tarjeta">
        <h2>Sesión iniciada</h2>
        <p>Entraste con el rol de {usuarioActual.rol}.</p>
        <p>
          En esta primera etapa tenemos el ingreso, la navegación y el cierre de
          sesión.
        </p>
      </section>
    </div>
  );
}
