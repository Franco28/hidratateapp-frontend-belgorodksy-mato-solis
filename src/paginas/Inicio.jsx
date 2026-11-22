import { FormularioAgua } from "../componentes/FormularioAgua.jsx";
import { ListaConsumos } from "../componentes/ListaConsumos.jsx";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";
import { consumosDelDia, fechaLocal, totalDelDia, mostrarMililitros } from "../utilidades/funciones.js";

export function Inicio() {
  const { datos, usuarioActual } = usarAplicacion();
  const fecha = fechaLocal();
  const consumos = consumosDelDia(datos.consumos, usuarioActual.id, fecha);
  const total = totalDelDia(datos.consumos, usuarioActual.id, fecha);

  return (
    <div>
      <div className="encabezado-pagina">
        <div>
          <span className="etiqueta">REGISTRO DEL DÍA</span>
          <h1>Hola, {usuarioActual.nombre.split(" ")[0]}</h1>
          <p>Registrá el agua que tomaste hoy.</p>
        </div>
      </div>
      <div className="cuadricula-inicio">
        <div className="columna">
          <FormularioAgua />
        </div>
        <div className="columna">
          <div className="tarjeta tarjeta-resumen">
            <small>Agua registrada hoy</small>
            <strong>{mostrarMililitros(total)}</strong>
          </div>
          <ListaConsumos consumos={consumos} titulo="Registro de hoy" />
        </div>
      </div>
    </div>
  );
}
