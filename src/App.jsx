  import React, { useState, useEffect } from 'react';
  import { PantallaInicio } from './pages/PantallaInicio.jsx';
  import { PantallaPerdidos } from './pages/PantallaPerdidos.jsx';
  import { PantallaRegistro } from './pages/PantallaRegistro.jsx';
  import { TuZona } from './components/TuZona';
  import { AyudaEncontrarlo } from './pages/AyudaEncontrarlo.jsx';
  import { EvaluacionAdoptante } from './components/EvaluacionAdoptante.jsx';

  import './App.css';

  function App() {
    // Estado con la ruta actual
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
      const handleLocationChange = () => {
        setCurrentPath(window.location.pathname);
      };

      // Detecta atrás/adelante del navegador
      window.addEventListener('popstate', handleLocationChange);

      return () => {
        window.removeEventListener('popstate', handleLocationChange);
      };
    }, []);

    // Normaliza rutas: evita "/" al final
    const path =
      currentPath !== '/' && currentPath.endsWith('/')
        ? currentPath.slice(0, -1)
        : currentPath;

    // Render basado en la ruta
    return (
      <div className="App">
        {path === '/' && <PantallaInicio />}
        {path === '/perdidos' && <PantallaPerdidos />}
        {path === '/registrar' && <PantallaRegistro />}
        {path === '/Tuzona' && <TuZona />}
        {path === '/ayuda' && <AyudaEncontrarlo />}
        {path === '/adopcion' && <EvaluacionAdoptante />}
      </div>  
    );
  }

  export default App;
