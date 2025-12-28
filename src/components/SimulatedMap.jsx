import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer, Marker } from '@react-google-maps/api';

const containerStyle = { 
    width: '100%', 
    height: '100%', 
    borderRadius: '15px' 
};

const libraries = ['visualization'];

export const SimulatedMap = ({ title, initialCenter, puntosExternos, miUbicacionActual }) => {
    const [center, setCenter] = useState({ lat: initialCenter[0], lng: initialCenter[1] });
    const [heatmapData, setHeatmapData] = useState([]);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyB567aI7-fFHoOgNYEEqM3jh4x5YESkjec", 
        libraries: libraries
    });

    // Sincroniza el centro del mapa cuando cambia la ubicación o la selección
    useEffect(() => {
        setCenter({ lat: initialCenter[0], lng: initialCenter[1] });
    }, [initialCenter]);

    useEffect(() => {
        if (isLoaded && window.google) {
            if (puntosExternos && puntosExternos.length > 0) {
                const googlePoints = puntosExternos.map(p => 
                    new window.google.maps.LatLng(p.lat, p.lng)
                );
                setHeatmapData(googlePoints);
            }
        }
    }, [isLoaded, puntosExternos]);

    if (loadError) return <div className="error-map">Error cargando Google Maps</div>;

    return (
        <div className="map-card-full">
            <h3 className="map-title-overlay">{title}</h3>
            <div className="map-wrapper-full">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={17} // Zoom alto para ver calles exactas
                        options={{ 
                            disableDefaultUI: false, 
                            zoomControl: true,
                            styles: retroStyle 
                        }}
                    >
                        {heatmapData.length > 0 && (
                            <HeatmapLayer 
                                data={heatmapData} 
                                options={{ radius: 30, opacity: 0.8 }}
                            />
                        )}

                        {miUbicacionActual && (
                            <>
                                {/* Círculo de sombra (aura de precisión) */}
                                <Marker
                                    position={{ lat: miUbicacionActual[0], lng: miUbicacionActual[1] }}
                                    icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        fillColor: '#4285F4',
                                        fillOpacity: 0.2,
                                        scale: 35,
                                        strokeWeight: 0
                                    }}
                                />
                                {/* Punto Azul Central */}
                                <Marker
                                    position={{ lat: miUbicacionActual[0], lng: miUbicacionActual[1] }}
                                    icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        fillColor: '#4285F4',
                                        fillOpacity: 1,
                                        strokeColor: 'white',
                                        strokeWeight: 2,
                                        scale: 8,
                                    }}
                                    title="Mi ubicación exacta"
                                    zIndex={1000}
                                />
                            </>
                        )}
                    </GoogleMap>
                ) : (
                    <div className="loader-map">Cargando mapa... 🐾</div>
                )}
            </div>
        </div>
    );
};

const retroStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#ebe3cd" }] },
    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#f5f1e6" }] }
];