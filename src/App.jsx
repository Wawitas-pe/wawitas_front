import React, { useState, useEffect } from 'react';
import { PantallaInicio } from './components/PantallaInicio';
import { PantallaPerdidos } from './components/PantallaPerdidos';
import { PantallaRegistro } from './components/PantallaRegistro';
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
      {/* Router Simple y Limpio */}
      {path === '/perdidos' ? (
        <PantallaPerdidos />
      ) : path === '/registrar' ? (
        <PantallaRegistro />
      ) : (
        <PantallaInicio />
      )}
    </div>
  );
}

export default App;