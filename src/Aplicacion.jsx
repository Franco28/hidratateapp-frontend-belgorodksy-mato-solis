import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { usarAplicacion } from "./contexto/ContextoAplicacion.jsx";
import { Menu } from "./componentes/Menu.jsx";
import { Ingreso } from "./paginas/Ingreso.jsx";
import { Inicio } from "./paginas/Inicio.jsx";
import { Historial } from "./paginas/Historial.jsx";

function RutaPrivada({ children }) {
  const { usuarioActual } = usarAplicacion();
  if (!usuarioActual) return <Navigate to="/ingreso" replace />;
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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
