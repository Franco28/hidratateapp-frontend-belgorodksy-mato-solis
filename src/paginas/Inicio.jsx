import { ProgresoAgua } from "../componentes/ProgresoAgua.jsx";
import { FormularioAgua } from "../componentes/FormularioAgua.jsx";
import { ListaConsumos } from "../componentes/ListaConsumos.jsx";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";
import {
  consumosDelDia,
  fechaLocal,
  mostrarMililitros,
  totalDelDia,
} from "../utilidades/funciones.js";

export function Inicio() {
  const { datos, usuarioActual } = usarAplicacion();
  const fecha = fechaLocal();
  const consumos = consumosDelDia(datos.consumos, usuarioActual.id, fecha);
  const total = totalDelDia(datos.consumos, usuarioActual.id, fecha);

  return (
    <div>
      <div className="encabezado-pagina">
        <div>
          <span className="etiqueta">RESUMEN DEL DÍA</span>
          <h1>Hola, {usuarioActual.nombre.split(" ")[0]}</h1>
          <p>Así viene tu consumo de agua hoy.</p>
        </div>
        <span className="fecha-actual">
          {new Date().toLocaleDateString("es-AR")}
        </span>
      </div>
      <div className="cuadricula-inicio">
        <div className="columna">
          <ProgresoAgua consumido={total} meta={usuarioActual.meta} />
          <FormularioAgua />
        </div>
        <div className="columna">
          <div className="resumen-doble">
            <div className="tarjeta tarjeta-resumen">
              <small>Consumido hoy</small>
              <strong>{mostrarMililitros(total)}</strong>
            </div>
            <div className="tarjeta tarjeta-resumen">
              <small>Meta diaria</small>
              <strong>{mostrarMililitros(usuarioActual.meta)}</strong>
            </div>
          </div>
          <ListaConsumos consumos={consumos} titulo="Registro de hoy" />
        </div>
      </div>
    </div>
  );
}
