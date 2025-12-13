import React, { useEffect, useState } from 'react';
import { Header } from './Header'; 
import { Footer } from './Footer'; 
import './PantallaPerdidos.css';

export const AyudaEncontrarlo = () => {
  const [perros, setPerros] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos de respaldo (solo si falla la API)
  const perrosMock = [
    { id: 101, nombre: 'Bobby', situacion: 'perdido', fotoUrl: 'https://placedog.net/500/500?id=1', ubicacion: 'Parque Kennedy' },
    { id: 102, nombre: 'Max', situacion: 'adopcion', fotoUrl: 'https://placedog.net/500/500?id=2', raza: 'Labrador' },
  ];

  const obtenerPerros = async () => {
    try {
      // Conexión a la API (Puerto 5000)
      const response = await fetch("http://localhost:5000/api/perro");
      
      if (!response.ok) throw new Error('Error al conectar con API');
      
      const data = await response.json();
      
      // Ordenamos por ID descendente para ver los nuevos primero
      const perrosOrdenados = data.sort((a, b) => b.id - a.id);

      // Si la API responde con datos, los usamos
      if (data.length > 0) {
        setPerros(perrosOrdenados);
      } else {
        setPerros([]); // Lista vacía real
      }

    } catch (error) {
      console.warn("⚠️ API no disponible. Usando datos de prueba.");
      setPerros(perrosMock); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPerros();
  }, []);

  return (
    <div className="pagina-container">
      <Header />

      <div className="title-container">
          <h2 className="page-title">GALERÍA DE WAWITAS</h2>
      </div>

      <main className="gallery-grid">
        {loading ? (
          <p className="loading-text">Cargando peluditos... 🐾</p>
        ) : perros.length > 0 ? (
          perros.map((perro) => (
            <div key={perro.id} className="pet-card">
              <div className="pet-image-wrapper">
                <img 
                  src={perro.fotoUrl && perro.fotoUrl.startsWith('http') ? perro.fotoUrl : 'https://placedog.net/500/500'} 
                  alt={perro.nombre}
                  onError={(e) => e.target.src = 'https://placedog.net/500/500'} 
                />
                
                {/* Badge de estado sobre la foto */}
                <span className={`status-badge-overlay ${perro.situacion}`}>
                  {perro.situacion ? perro.situacion.toUpperCase() : 'DESCONOCIDO'}
                </span>
              </div>

              <div className="pet-info">
                <h3 className="pet-name">{perro.nombre}</h3>
                
                {/* Detalles adicionales si existen */}
                {perro.raza && <p className="pet-detail">🐶 {perro.raza}</p>}
                {perro.ubicacion && <p className="pet-detail">📍 {perro.ubicacion}</p>}
                
                {/* Badge de Herido (solo si es true) */}
                {perro.estaHerido && (
                  <span className="badge-herido">🚑 HERIDO</span>
                )}
                
                {/* Cantidad si es mayor a 1 */}
                {perro.cantidad > 1 && (
                  <span className="badge-cantidad">+{perro.cantidad} vistos</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="loading-text" style={{gridColumn: '1 / -1', marginTop: '50px'}}>
            <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#888'}}>
              No hay perritos registrados 🐶
            </p>
            <small style={{color: '#aaa'}}>Sé el primero en registrar uno.</small>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};