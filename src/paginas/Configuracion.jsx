import { useState } from "react";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";

export function Configuracion() {
  const { usuarioActual, guardarConfiguracion } = usarAplicacion();
  const [nombre, setNombre] = useState(usuarioActual.nombre);
  const [meta, setMeta] = useState(usuarioActual.meta);
  const [recordatorios, setRecordatorios] = useState(
    usuarioActual.recordatorios,
  );
  const [minutos, setMinutos] = useState(usuarioActual.minutosRecordatorio);
  const [error, setError] = useState("");

  function guardar(evento) {
    evento.preventDefault();
    try {
      guardarConfiguracion(nombre, meta, recordatorios, minutos);
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
        <input
          id="nombre"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          minLength="2"
          maxLength="60"
          required
        />

        <h2>Meta diaria</h2>
        <p>Elegí cuánta agua querés registrar por día.</p>
        <label htmlFor="meta">Meta en mililitros</label>
        <input
          id="meta"
          type="number"
          min="250"
          max="10000"
          step="250"
          value={meta}
          onChange={(evento) => setMeta(evento.target.value)}
          required
        />

        <h2>Recordatorios</h2>
        <label className="opcion-checkbox" htmlFor="recordatorios">
          <input
            id="recordatorios"
            type="checkbox"
            checked={recordatorios}
            onChange={(evento) => setRecordatorios(evento.target.checked)}
          />
          Mostrar recordatorios cuando la aplicación esté abierta
        </label>
        <label htmlFor="minutos">Frecuencia</label>
        <select
          id="minutos"
          value={minutos}
          onChange={(evento) => setMinutos(Number(evento.target.value))}
          disabled={!recordatorios}
        >
          <option value="30">Cada 30 minutos</option>
          <option value="60">Cada 1 hora</option>
          <option value="120">Cada 2 horas</option>
        </select>
        <p className="nota">
          Los avisos solo se muestran cuando la página está abierta y visible.
        </p>

        {error && (
          <p className="mensaje-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="boton-principal">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
