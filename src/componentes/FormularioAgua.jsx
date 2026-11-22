import { useState } from "react";
import { usarAplicacion } from "../contexto/ContextoAplicacion.jsx";

const cantidades = [250, 500, 750, 1000];

export function FormularioAgua() {
  const { agregarConsumo } = usarAplicacion();
  const [cantidadPersonalizada, setCantidadPersonalizada] = useState("");
  const [error, setError] = useState("");

  function registrarAgua(cantidad) {
    try {
      agregarConsumo(cantidad);
      setError("");
      const sonido = new Audio("/audio/agua_agregar.wav");
      sonido.volume = 0.3;
      sonido.play().catch(() => {});
      return true;
    } catch (problema) {
      setError(problema.message);
      return false;
    }
  }

  function agregarCantidadPersonalizada(evento) {
    evento.preventDefault();
    if (registrarAgua(Number(cantidadPersonalizada))) {
      setCantidadPersonalizada("");
    }
  }

  return (
    <section className="tarjeta">
      <h2>Agregar agua</h2>
      <p>Seleccioná la cantidad que tomaste.</p>
      <div className="botones-cantidad">
        {cantidades.map((cantidad) => (
          <button
            key={cantidad}
            type="button"
            onClick={() => registrarAgua(cantidad)}
          >
            +{cantidad} ml
          </button>
        ))}
      </div>
      <form
        onSubmit={agregarCantidadPersonalizada}
        className="formulario-cantidad"
      >
        <label htmlFor="cantidad">Otra cantidad (ml)</label>
        <div className="fila-formulario">
          <input
            id="cantidad"
            type="number"
            min="1"
            max="5000"
            step="1"
            value={cantidadPersonalizada}
            onChange={(evento) => setCantidadPersonalizada(evento.target.value)}
            placeholder="Ejemplo: 350"
            required
          />
          <button type="submit" className="boton-principal">
            Agregar
          </button>
        </div>
      </form>
      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
