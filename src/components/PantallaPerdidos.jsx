import React, { useEffect, useState } from 'react';
import { Header } from './Header'; 
import { Footer } from './Footer'; 
import './PantallaPerdidos.css';

export const PantallaPerdidos = () => {
  const [perros, setPerros] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Conexión con tu Backend .NET
  const obtenerPerros = async () => {
    try {
      // OJO: Asegúrate que el puerto (5000) sea el real de tu API al ejecutarla
      const response = await fetch("http://localhost:5000/api/perro");
      
      if (!response.ok) throw new Error('Error al conectar con API');
      
      const data = await response.json();
      
      // Filtramos para mostrar solo los perdidos (según tu diseño)
      // Si quieres mostrar todos, quita el .filter()
      const soloPerdidos = data.filter(p => p.situacion === 'perdido');
      
      setPerros(soloPerdidos.length > 0 ? soloPerdidos : data); // Fallback a todos si no hay perdidos para probar
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPerros();
  }, []);

  return (
    <div className="pagina-container">
      
      {/* 2. Header Reutilizable */}
      <Header />

      <div className="title-container">
          <h2 className="page-title">PERDIDOS</h2>
      </div>

      {/* 3. Grid de Perritos (Responsive) */}
      <main className="gallery-grid">
        {loading ? (
          <p className="loading-text">Buscando huellitas... 🐾</p>
        ) : perros.length > 0 ? (
          perros.map((perro) => (
            <div key={perro.id} className="pet-card">
              <div className="pet-image-wrapper">
                <img 
                  src={perro.fotoUrl || 'https://placedog.net/500/500'} 
                  alt={perro.nombre}
                  // Si la imagen falla, ponemos una por defecto
                  onError={(e) => e.target.src = 'https://placedog.net/500/500'} 
                />
              </div>
              <h3 className="pet-name">{perro.nombre}</h3>
            </div>
          ))
        ) : (
          <p className="loading-text">No hay reportes de perritos perdidos.</p>
        )}
      </main>

      {/* 4. Footer Reutilizable */}
      <Footer />
      
    </div>
  );
};