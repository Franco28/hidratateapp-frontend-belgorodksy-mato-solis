export function fechaLocal(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function consumosDelDia(consumos, idUsuario, fecha) {
  return consumos
    .filter(
      (consumo) =>
        consumo.idUsuario === idUsuario &&
        fechaLocal(new Date(consumo.fecha)) === fecha,
    )
    .sort(
      (primero, segundo) => new Date(segundo.fecha) - new Date(primero.fecha),
    );
}

export function totalDelDia(consumos, idUsuario, fecha) {
  return consumosDelDia(consumos, idUsuario, fecha).reduce(
    (total, consumo) => total + consumo.cantidad,
    0,
  );
}

export function validarCantidad(cantidad) {
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 5000) {
    throw new Error("Ingresá una cantidad entre 1 y 5000 ml.");
  }
  return cantidad;
}

export function mostrarMililitros(cantidad) {
  return `${Number(cantidad).toLocaleString("es-AR")} ml`;
}

export function mostrarHora(fecha) {
  return new Date(fecha).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
