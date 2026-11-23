import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
});

export function mostrarToast(mensaje) {
  return toast.fire({
    icon: "success",
    title: mensaje,
  });
}

export function mostrarError(mensaje) {
  return Swal.fire({
    icon: "error",
    title: "Ocurrió un problema",
    text: mensaje,
    confirmButtonText: "Entendido",
  });
}

export async function confirmarEliminacion(mensaje) {
  const resultado = await Swal.fire({
    icon: "warning",
    title: "¿Confirmás la eliminación?",
    text: mensaje,
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    reverseButtons: true,
  });

  return resultado.isConfirmed;
}
