import React, { useState, useEffect } from 'react';

// Componente de Mapa Simulado (Sin Leaflet)
export const SimulatedMap = ({ title, initialCenter, isMainMap = false }) => {
    // Usamos las coordenadas para simular la vista, pero no para renderizar un mapa real
    const [status, setStatus] = useState(
        isMainMap 
            ? "Permite la geolocalización para ver los reportes cercanos." 
            : `Ubicación predefinida: ${title}`
    );
    const [userLocation, setUserLocation] = useState(initialCenter);
    const [mapState, setMapState] = useState(isMainMap ? 'initial' : 'active'); // 'initial', 'loading', 'active'
    
    // Función para simular la solicitud de geolocalización (usando la API real del navegador)
    const requestLocation = () => {
        if (!isMainMap) return; 

        setMapState('loading');
        setStatus('🔎 Buscando tu ubicación...');
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const simulatedLat = position.coords.latitude; 
                    const simulatedLng = position.coords.longitude; 
                    
                    setUserLocation([simulatedLat, simulatedLng]);
                    setStatus(`¡Ubicación encontrada! (${simulatedLat.toFixed(4)}, ${simulatedLng.toFixed(4)})`);
                    setMapState('active');
                },
                (error) => {
                    console.error("Error obteniendo ubicación:", error);
                    // Fallback a la ubicación inicial si falla
                    setUserLocation(initialCenter);
                    setStatus("Ubicación denegada. Mostrando la ubicación predeterminada.");
                    setMapState('active');
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setStatus("Geolocalización no soportada por el navegador.");
            setMapState('active');
        }
    };
    
    useEffect(() => {
        if (!isMainMap) {
            setMapState('active');
        }
    }, [isMainMap]);

    return (
        <div className={`map-card ${isMainMap ? 'main-map' : 'small-map'}`}>
            <h3 className="map-title">{title}</h3>
            
            <div className={`map-placeholder ${mapState}`}>
                
                {mapState === 'initial' && isMainMap && (
                    <div className="location-prompt">
                        <p>{status}</p>
                        <button onClick={requestLocation} className="locate-button">
                            Permitir Geolocalización
                        </button>
                    </div>
                )}

                {mapState === 'loading' && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p>{status}</p>
                    </div>
                )}
                
                {mapState === 'active' && (
                    <div className="map-content">
                        {/* Simulación visual del mapa (sin zoom ni panorámica real) */}
                        <p className="simulated-location-text">
                           {title.includes('Tu Ubicación') ? `Lat: ${userLocation[0].toFixed(4)}, Lng: ${userLocation[1].toFixed(4)}` : `Ubicación Fija`}
                        </p>
                        
                        {/* Puntos de calor simulados visualmente */}
                        <div className="heatmap-simulation">
                            <div className="heat-point large" style={{ top: '30%', left: '20%', backgroundColor: 'rgba(255, 0, 0, 0.7)' }}></div>
                            <div className="heat-point medium" style={{ top: '65%', left: '70%', backgroundColor: 'rgba(255, 140, 0, 0.7)' }}></div>
                            <div className="heat-point small" style={{ top: '10%', left: '85%', backgroundColor: 'rgba(255, 0, 0, 0.7)' }}></div>
                            <div className="heat-point large" style={{ top: '80%', left: '45%', backgroundColor: 'rgba(255, 140, 0, 0.7)' }}></div>
                        </div>
                    </div>
                )}
            </div>
            
            <p className="map-description">
                {isMainMap ? (
                    "Este mapa simula los reportes de perros perdidos cerca de tu ubicación."
                ) : (
                    "Concentración simulada de reportes en esta zona."
                )}
            </p>
        </div>
    );
};