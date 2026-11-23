import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { usarAplicacion } from "./contexto/ContextoAplicacion.jsx";
import { Menu } from "./componentes/Menu.jsx";
import { Ingreso } from "./paginas/Ingreso.jsx";
import { Inicio } from "./paginas/Inicio.jsx";
import { Historial } from "./paginas/Historial.jsx";
import { Configuracion } from "./paginas/Configuracion.jsx";
import { Usuarios } from "./paginas/Usuarios.jsx";

function RutaPrivada({ children, soloAdministrador = false }) {
  const { usuarioActual } = usarAplicacion();
  if (!usuarioActual) return <Navigate to="/ingreso" replace />;
  if (soloAdministrador && usuarioActual.rol !== "administrador") {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function Aplicacion() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ingreso" element={<Ingreso />} />
        <Route element={<RutaPrivada><Menu /></RutaPrivada>}>
          <Route index element={<Inicio />} />
          <Route path="historial" element={<Historial />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="usuarios" element={<RutaPrivada soloAdministrador><Usuarios /></RutaPrivada>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
