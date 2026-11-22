import { mostrarMililitros } from "../utilidades/funciones.js";

export function ProgresoAgua({ consumido, meta }) {
  const porcentaje = Math.round((consumido * 100) / meta);
  const porcentajeCirculo = Math.min(porcentaje, 100);

  return (
    <section className="tarjeta tarjeta-progreso">
      <h2>Mi progreso de hoy</h2>
      <div
        className="circulo-progreso"
        style={{ "--progreso": `${porcentajeCirculo}%` }}
        role="progressbar"
        aria-label="Porcentaje de la meta diaria"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={porcentajeCirculo}
      >
        <div className="centro-circulo">
          <img className="icono-agua" src="/imagenes/icono.png" alt="" />
          <strong>{mostrarMililitros(consumido)}</strong>
          <small>de {mostrarMililitros(meta)}</small>
          <b>{porcentaje}%</b>
        </div>
      </div>
      <p className="texto-centrado">
        {consumido >= meta
          ? "¡Completaste la meta diaria!"
          : `Te faltan ${mostrarMililitros(meta - consumido)} para tu meta.`}
      </p>
    </section>
  );
}
