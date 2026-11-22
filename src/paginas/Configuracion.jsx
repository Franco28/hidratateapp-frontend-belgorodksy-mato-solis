import { useState } from "react";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";

export function Configuracion() {
  const { usuarioActual, guardarConfiguracion } = usarAplicacion();
  const [nombre, setNombre] = useState(usuarioActual.nombre);
  const [meta, setMeta] = useState(usuarioActual.meta);
  const [error, setError] = useState("");

  function guardar(evento) {
    evento.preventDefault();
    try {
      guardarConfiguracion(nombre, meta);
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <div>
      <div className="encabezado-pagina">
        <div>
          <span className="etiqueta">MI CUENTA</span>
          <h1>Configuración</h1>
          <p>Modificá tus datos y tu meta diaria.</p>
        </div>
      </div>
      <form className="tarjeta formulario-configuracion" onSubmit={guardar}>
        <h2>Mis datos</h2>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" value={nombre} minLength="2" maxLength="60"
          onChange={(evento) => setNombre(evento.target.value)} required />

        <h2>Meta diaria</h2>
        <label htmlFor="meta">Meta en mililitros</label>
        <input id="meta" type="number" min="250" max="10000" step="250"
          value={meta} onChange={(evento) => setMeta(evento.target.value)} required />

        {error && <p className="mensaje-error" role="alert">{error}</p>}
        <button type="submit" className="boton-principal">Guardar cambios</button>
      </form>
    </div>
  );
}
