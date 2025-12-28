import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ReportModal.css';
import DogService from '../../services/DogService.jsx';

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

export const ReportModal = ({ isVisible, onClose, onReportSuccess }) => {
    const [form, setForm] = useState({ 
        nombre: '', 
        raza: '', 
        descripcion: '', 
        fotoUrl: '' 
    });
    const [address, setAddress] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [coordinates, setCoordinates] = useState([-12.0463, -77.0427]);

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') onClose();
    };

    const handleUrlChange = (e) => {
        setForm({ ...form, fotoUrl: e.target.value });
    };

    const handleSearch = async (text) => {
        setAddress(text);
        if (text.length > 3) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${text}&limit=5`);
                const data = await response.json();
                setSuggestions(data);
            } catch (error) { console.error(error); }
        } else { setSuggestions([]); }
    };

    const MapEvents = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setCoordinates([lat, lng]);
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const data = await res.json();
                if (data.display_name) setAddress(data.display_name);
            },
        });
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.id : 0;

        try {
            const nuevoReporte = {
                userId: userId,
                nombre: form.nombre,
                raza: form.raza,
                descripcion: form.descripcion,
                fotoUrl: form.fotoUrl || "https://placedog.net/500/500",
                ultimaDireccion: address,
                ultimaLatitud: coordinates[0],
                ultimaLongitud: coordinates[1]
            };

            // Enviar a la DB
            await DogService.newLostDog(nuevoReporte);
            
            // Limpiar estados
            setForm({ nombre: '', raza: '', descripcion: '', fotoUrl: '' });
            setAddress("");
            
            // CERRAR MODAL Y RECARGAR LISTA
            onClose(); 
            if (onReportSuccess) onReportSuccess();
            
            alert("¡Reporte publicado con éxito! 🐾");
        } catch (error) { 
            alert("Error al guardar: " + error.message); 
        }
    };

    if (!isVisible) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="report-modal">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h3>📢 Reportar Avistamiento</h3>
                <form onSubmit={handleSubmit} className="report-form-scroll">
                    <div className="form-group">
                        <label>Nombre de la mascota *</label>
                        <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: Pepito" required />
                    </div>
                    <div className="form-group">
                        <label>Raza *</label>
                        <input type="text" value={form.raza} onChange={e => setForm({...form, raza: e.target.value})} placeholder="Ej: Cruzado" required />
                    </div>
                    
                    <div className="form-group">
                        <label>Descripción *</label>
                        <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Detalles adicionales..." required></textarea>
                    </div>

                    <div className="form-group">
                        <label>URL de la Foto</label>
                        <input 
                            type="text" 
                            placeholder="🔗 Pega el enlace de la imagen aquí..." 
                            value={form.fotoUrl} 
                            onChange={handleUrlChange} 
                            className="url-input" 
                        />
                        {form.fotoUrl && (
                            <div className="image-preview-wrapper" style={{ marginTop: '10px', position: 'relative' }}>
                                <img 
                                    src={form.fotoUrl} 
                                    alt="Vista previa" 
                                    className="image-preview-report" 
                                    style={{ width: '100%', borderRadius: '8px' }}
                                    onError={(e) => e.target.style.display = 'none'} 
                                />
                                <button 
                                    type="button" 
                                    className="remove-img-btn"
                                    style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }} 
                                    onClick={() => setForm({...form, fotoUrl: ''})}
                                >×</button>
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Ubicación *</label>
                        <input type="text" value={address} onChange={(e) => handleSearch(e.target.value)} placeholder="Busca o marca el mapa" required />
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((s, i) => (
                                    <li key={i} onClick={() => {
                                        setCoordinates([parseFloat(s.lat), parseFloat(s.lon)]);
                                        setAddress(s.display_name);
                                        setSuggestions([]);
                                    }}>{s.display_name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="map-container">
                        <MapContainer center={coordinates} zoom={14} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapEvents />
                            <RecenterMap coords={coordinates} />
                            <Marker position={coordinates} />
                        </MapContainer>
                    </div>

                    <button type="submit" className="btn-send-report">Publicar Reporte 🐾</button>
                </form>
            </div>
        </div>
    );
};