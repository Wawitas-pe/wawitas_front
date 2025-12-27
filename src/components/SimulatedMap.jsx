import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';

const containerStyle = { 
    width: '100%', 
    height: '400px', // Altura obligatoria para que el mapa sea visible
    borderRadius: '15px' 
};

// Se define fuera para evitar recargas infinitas
const libraries = ['visualization'];

export const SimulatedMap = ({ title, initialCenter, isMainMap }) => {
    const [center, setCenter] = useState({ lat: initialCenter[0], lng: initialCenter[1] });
    const [heatmapData, setHeatmapData] = useState([]);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyB567aI7-fFHoOgNYEEqM3jh4x5YESkjec", // Tu API Key
        libraries: libraries
    });

    // Función para crear puntos de calor falsos alrededor de una coordenada
    const generarPuntosSimulados = useCallback((lat, lng) => {
        if (!window.google) return;
        const mockPoints = [
            new window.google.maps.LatLng(lat + 0.001, lng + 0.001),
            new window.google.maps.LatLng(lat - 0.001, lng - 0.002),
            new window.google.maps.LatLng(lat + 0.002, lng - 0.001),
            new window.google.maps.LatLng(lat, lng),
        ];
        setHeatmapData(mockPoints);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            if (isMainMap && navigator.geolocation) {
                // Pedir permiso de ubicación
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userPos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        setCenter(userPos);
                        generarPuntosSimulados(userPos.lat, userPos.lng);
                    },
                    () => {
                        console.warn("Ubicación denegada. Usando centro predeterminado.");
                        generarPuntosSimulados(initialCenter[0], initialCenter[1]);
                    }
                );
            } else {
                generarPuntosSimulados(initialCenter[0], initialCenter[1]);
            }
        }
    }, [isLoaded, isMainMap, initialCenter, generarPuntosSimulados]);

    if (loadError) return <div>Error cargando mapas. Revisa tu conexión o API Key.</div>;

    return (
        <div className="map-card">
            <h3 className="map-title">{title}</h3>
            <div className="map-wrapper">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={15}
                        options={{ disableDefaultUI: true, zoomControl: true }}
                    >
                        {heatmapData.length > 0 && <HeatmapLayer data={heatmapData} />}
                    </GoogleMap>
                ) : (
                    <div className="loader">Cargando mapa... 🐾</div>
                )}
            </div>
        </div>
    );
};