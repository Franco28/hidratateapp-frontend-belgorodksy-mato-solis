import test from "node:test";
import assert from "node:assert/strict";
import { fechaLocal, totalDelDia, validarCantidad } from "../src/utilidades/funciones.js";

test("la fecha usa el formato año-mes-día", () => {
  assert.equal(fechaLocal(new Date(2026, 10, 1)), "2026-11-01");
});

test("los consumos se suman por usuario", () => {
  const registros = [
    { id: "1", idUsuario: "a", cantidad: 250, fecha: "2026-11-01T13:00:00" },
    { id: "2", idUsuario: "b", cantidad: 500, fecha: "2026-11-01T15:00:00" },
  ];
  assert.equal(totalDelDia(registros, "a", "2026-11-01"), 250);
});

test("no se permite una cantidad inválida", () => {
  assert.throws(() => validarCantidad(0));
  assert.equal(validarCantidad(500), 500);
});
