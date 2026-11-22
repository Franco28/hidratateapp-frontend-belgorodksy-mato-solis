import { mostrarHora, mostrarMililitros } from "../utilidades/funciones.js";

export function ListaConsumos({ consumos, titulo = "Consumos registrados" }) {
  return (
    <section className="tarjeta">
      <h2>{titulo}</h2>
      {consumos.length === 0 ? (
        <p className="sin-registros">Todavía no cargaste consumos para esta fecha.</p>
      ) : (
        <ul className="lista-consumos">
          {consumos.map((consumo) => (
            <li key={consumo.id}>
              <span className="vaso">AGUA</span>
              <div>
                <strong>{mostrarMililitros(consumo.cantidad)}</strong>
                <small>{mostrarHora(consumo.fecha)}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
