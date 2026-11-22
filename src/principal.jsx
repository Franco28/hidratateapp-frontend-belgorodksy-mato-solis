import React from 'react';
import { createRoot } from 'react-dom/client';
import { ProveedorAplicacion } from './contexto/ContextoAplicacion.jsx';
import { Aplicacion } from './Aplicacion.jsx';
import './estilos.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProveedorAplicacion>
      <Aplicacion />
    </ProveedorAplicacion>
  </React.StrictMode>
);
