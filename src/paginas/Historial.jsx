import { useState } from "react";
import { ListaConsumos } from "../componentes/ListaConsumos.jsx";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";
import {
  consumosDelDia,
  fechaLocal,
  mostrarMililitros,
  totalDelDia,
} from "../utilidades/funciones.js";

export function Historial() {
  const { datos, usuarioActual } = usarAplicacion();
  const [fecha, setFecha] = useState(fechaLocal());
  const consumos = consumosDelDia(datos.consumos, usuarioActual.id, fecha);
  const total = totalDelDia(datos.consumos, usuarioActual.id, fecha);

  const semana = [];
  for (let diasAtras = 6; diasAtras >= 0; diasAtras--) {
    const dia = new Date();
    dia.setDate(dia.getDate() - diasAtras);
    const fechaDia = fechaLocal(dia);
    semana.push({
      fecha: fechaDia,
      nombre: dia.toLocaleDateString("es-AR", { weekday: "short" }),
      cantidad: totalDelDia(datos.consumos, usuarioActual.id, fechaDia),
    });
  }

  const mayorCantidad = Math.max(
    usuarioActual.meta,
    ...semana.map((dia) => dia.cantidad),
  );

  return (
    <div>
      <div className="encabezado-pagina">
        <div>
          <span className="etiqueta">MIS CONSUMOS</span>
          <h1>Historial</h1>
          <p>Podés consultar los registros por fecha.</p>
        </div>
      </div>

      <section className="tarjeta espacio-inferior">
        <h2>Últimos 7 días</h2>
        <p>Seleccioná una barra para ver los consumos de ese día.</p>
        <div className="grafico-semana">
          {semana.map((dia) => (
            <button
              type="button"
              key={dia.fecha}
              className={
                fecha === dia.fecha ? "dia-grafico dia-elegido" : "dia-grafico"
              }
              onClick={() => setFecha(dia.fecha)}
              title={`${dia.fecha}: ${mostrarMililitros(dia.cantidad)}`}
            >
              <span>{dia.cantidad > 0 ? `${dia.cantidad} ml` : "0"}</span>
              <span className="zona-barra">
                <span
                  className="barra-agua"
                  style={{ height: `${(dia.cantidad / mayorCantidad) * 100}%` }}
                />
              </span>
              <small>{dia.nombre}</small>
            </button>
          ))}
        </div>
      </section>

      <div className="filtro-fecha tarjeta espacio-inferior">
        <label htmlFor="fecha">Buscar por fecha</label>
        <input
          id="fecha"
          type="date"
          max={fechaLocal()}
          value={fecha}
          onChange={(evento) => setFecha(evento.target.value)}
        />
        <strong>Total: {mostrarMililitros(total)}</strong>
      </div>
      <ListaConsumos
        consumos={consumos}
        titulo="Consumos del día seleccionado"
      />
    </div>
  );
}
