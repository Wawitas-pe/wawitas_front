import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DogService from '../../services/DogService.jsx';
import './AbuseReportModal.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(coords);
    }, [coords, map]);
    return null;
};

export const AbuseReportModal = ({ isVisible, onClose }) => {
    const [coords, setCoords] = useState([-12.0463, -77.0427]); // Lima por defecto
    const [fotoUrl, setFotoUrl] = useState(""); // Cambiado de preview a fotoUrl
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isVisible && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCoords([pos.coords.latitude, pos.coords.longitude]),
                () => console.log("Ubicación no permitida")
            );
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const MapEvents = () => {
        useMapEvents({
            click: (e) => {
                setCoords([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    };

    const handleConfirmAndSubmit = async () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        
        const reportData = {
            usuario_reporta_id: user ? user.id : 0,
            perro_id: null, 
            fecha: new Date().toISOString(),
            // Enviamos la URL escrita o la imagen por defecto
            foto_evidencia: fotoUrl || "https://placedog.net/500/500", 
            latitud: coords[0],
            longitud: coords[1]
        };

        try {
            await DogService.reportAbuse(reportData);
            alert("Reporte enviado correctamente. Gracias por tu valentía.");
            // Limpiar estado antes de cerrar
            setFotoUrl("");
            onClose();
        } catch (error) {
            alert("Error al enviar reporte: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const confirmation = window.confirm(
            "ADVERTENCIA:\n\n" +
            "Estás a punto de enviar un reporte de emergencia. " +
            "Estos reportes son tomados con la máxima seriedad y pueden iniciar acciones con autoridades locales.\n\n" +
            "Por favor, confirma que la información es verídica y que la situación requiere atención urgente.\n\n" +
            "¿Deseas continuar?"
        );

        if (confirmation) {
            handleConfirmAndSubmit();
        }
    };

    return (
        <div className="abuse-modal-overlay">
            <div className="abuse-modal-card">
                <div className="abuse-header">
                    <h2>🚨 Reportar Caso Urgente</h2>
                    <p>Usa este formulario para reportar maltrato o un perro en situación crítica.</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="map-section">
                        <label>Ubicación del incidente (Toca el mapa):</label>
                        <div className="map-wrapper">
                            <MapContainer center={coords} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapEvents />
                                <RecenterMap coords={coords} />
                                <Marker position={coords} />
                            </MapContainer>
                        </div>
                        <p className="coords-text">Lat: {coords[0].toFixed(5)}, Lng: {coords[1].toFixed(5)}</p>
                    </div>

                    <div className="evidence-section">
                        <label>URL de Evidencia Fotográfica:</label>
                        <input 
                            type="text" 
                            className="url-input-abuse"
                            placeholder="🔗 Pega el enlace de la imagen aquí..."
                            value={fotoUrl}
                            onChange={(e) => setFotoUrl(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '5px',
                                borderRadius: '5px',
                                border: '1px solid #ccc'
                            }}
                        />
                        
                        {fotoUrl && (
                            <div className="preview-container" style={{ marginTop: '10px', position: 'relative' }}>
                                <img 
                                    src={fotoUrl} 
                                    alt="Evidencia" 
                                    className="evidence-preview" 
                                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setFotoUrl("")}
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '25px',
                                        height: '25px',
                                        cursor: 'pointer'
                                    }}
                                >×</button>
                            </div>
                        )}
                    </div>

                    <div className="abuse-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-submit-abuse" disabled={loading}>
                            {loading ? 'Enviando...' : 'ENVIAR REPORTE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};