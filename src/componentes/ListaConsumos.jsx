import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";
import { mostrarHora, mostrarMililitros } from "../utilidades/funciones.js";
import { confirmarEliminacion, mostrarError } from "../utilidades/notificaciones.js";

export function ListaConsumos({ consumos, titulo = "Consumos registrados" }) {
  const { eliminarConsumo } = usarAplicacion();

  async function quitarConsumo(id) {
    if (!(await confirmarEliminacion("Se eliminará este consumo."))) return;
    try {
      eliminarConsumo(id);
      const sonido = new Audio("/audio/agua_eliminar.wav");
      sonido.volume = 0.2;
      sonido.play().catch(() => {});
    } catch (problema) {
      mostrarError(problema.message);
    }
  }

  return (
    <section className="tarjeta">
      <h2>{titulo}</h2>
      {consumos.length === 0 ? (
        <p className="sin-registros">
          Todavía no cargaste consumos para esta fecha.
        </p>
      ) : (
        <ul className="lista-consumos">
          {consumos.map((consumo) => (
            <li key={consumo.id}>
              <span className="vaso">AGUA</span>
              <div>
                <strong>{mostrarMililitros(consumo.cantidad)}</strong>
                <small>{mostrarHora(consumo.fecha)}</small>
              </div>
              <button
                className="boton-eliminar"
                type="button"
                onClick={() => quitarConsumo(consumo.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
