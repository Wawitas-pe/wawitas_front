import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DogService from '../../services/DogService.jsx';
import './SightingModal.css';

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

export const SightingModal = ({ isVisible, onClose, onSightingSuccess }) => {
    const [coords, setCoords] = useState([-12.0463, -77.0427]); // Lima por defecto
    const [address, setAddress] = useState("");
    const [preview, setPreview] = useState(null);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const MapEvents = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setCoords([lat, lng]);
                
                // Geocodificación inversa simple
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await res.json();
                    if (data.display_name) setAddress(data.display_name);
                } catch (error) {
                    console.error("Error al obtener dirección", error);
                }
            },
        });
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const sightingData = {
            fecha: new Date().toISOString(),
            direccion: address || "Ubicación marcada en mapa",
            fotoEvidencia: preview || "https://placedog.net/500/500", // Aquí deberías subir la imagen real
            latitud: coords[0],
            longitud: coords[1]
        };

        try {
            await DogService.registerSighting(sightingData);
            alert("¡Avistamiento registrado! Gracias por ayudar.");
            if (onSightingSuccess) onSightingSuccess();
            onClose();
            // Limpiar form
            setAddress("");
            setPreview(null);
        } catch (error) {
            alert("Error al registrar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sighting-modal-overlay">
            <div className="sighting-modal-card">
                <div className="sighting-header">
                    <h2>📍 Registrar Avistamiento</h2>
                    <p>Marca en el mapa dónde viste a la mascota.</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="map-section">
                        <div className="map-wrapper">
                            <MapContainer center={coords} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapEvents />
                                <RecenterMap coords={coords} />
                                <Marker position={coords} />
                            </MapContainer>
                        </div>
                        <p className="coords-text">Toca el mapa para marcar la ubicación exacta.</p>
                    </div>

                    <div className="form-fields">
                        <div className="input-group">
                            <label>Dirección (Autocompletada)</label>
                            <input 
                                type="text" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                placeholder="Ej: Parque Kennedy, Miraflores"
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label className="upload-btn">
                                📸 Subir Foto (Opcional)
                                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                            </label>
                            {preview && <img src={preview} alt="Evidencia" className="evidence-preview" />}
                        </div>
                    </div>

                    <div className="sighting-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-submit-sighting" disabled={loading}>
                            {loading ? 'Registrando...' : 'CONFIRMAR AVISTAMIENTO'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};