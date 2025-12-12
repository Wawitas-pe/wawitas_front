import React, { useState, useEffect } from 'react';
import { PantallaInicio } from './components/PantallaInicio';
import { PantallaPerdidos } from './components/PantallaPerdidos';
import { PantallaRegistro } from './components/PantallaRegistro';
import { TuZona } from './components/TuZona';
import {AyudaEncontrarlo} from './components/AyudaEncontrarlo'


import './App.css';

function App() {
  // Estado para la ruta actual
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Escuchar cambios de historial (atrás/adelante)
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Normalizamos la ruta para evitar problemas con slash final (ej: "/perdidos/")
  const path = currentPath.endsWith('/') && currentPath.length > 1 
    ? currentPath.slice(0, -1) 
    : currentPath;

  return (
  <div className="App">
    {path === '/perdidos' ? (
      <PantallaPerdidos />
    ) : path === '/registrar' ? (
      <PantallaRegistro />
    ) : path === '/tuzona' ? ( // <-- Nueva condición
      <TuZona/>
    ) : path === '/ayuda'?(
      <AyudaEncontrarlo/>
    ) : (
      <PantallaInicio /> // <-- Condición final (Home)
    )}
  </div>
);
}

export default App;