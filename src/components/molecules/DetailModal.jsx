import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DetailModal.css';
import DogService from '../../services/DogService.jsx';
import { LoginModal } from './LoginModal.jsx';

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
        if (coords) map.setView(coords, 16);
    }, [coords, map]);
    return null;
};

export const DetailModal = ({ isVisible, dog, onClose, onUpdate }) => {
    const [editMode, setEditMode] = useState(false);
    const [tempCoords, setTempCoords] = useState(null);
    const [tempAddress, setTempAddress] = useState("");
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!isVisible) {
            setEditMode(false);
            setTempCoords(null);
            setTempAddress("");
        }
    }, [isVisible]);

    if (!isVisible || !dog) return null;

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') {
            onClose();
        }
    };

    const handleButtonClick = () => {
        if (user) {
            setEditMode(true);
        } else {
            setIsLoginModalVisible(true);
        }
    };

    const handleContactClick = () => {
        if (dog.telefono) {
            const message = `Hola, vi el reporte de ${dog.nombre} en Wawitas y tengo información.`;
            const url = `https://wa.me/51${dog.telefono}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        } else {
            alert("El número de contacto no está disponible.");
        }
    };

    // Adaptación para usar latitud/longitud del backend
    const position = tempCoords 
        ? [tempCoords.lat, tempCoords.lng] 
        : (dog.latitud && dog.longitud ? [dog.latitud, dog.longitud] : [-12.0463, -77.0427]);

    const MapEvents = () => {
        useMapEvents({
            click: async (e) => {
                if (!editMode) return;
                const { lat, lng } = e.latlng;
                setTempCoords({ lat, lng });
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await res.json();
                    if (data.display_name) setTempAddress(data.display_name);
                } catch (error) {
                    console.error(error);
                }
            },
        });
        return null;
    };

    const handleUpdateLocation = async () => {
        try {
            const updatedDog = {
                ...dog,
                ultimaDireccion: tempAddress || dog.ultimaDireccion,
                latitud: tempCoords ? tempCoords.lat : dog.latitud,
                longitud: tempCoords ? tempCoords.lng : dog.longitud
            };
            const data = await DogService.updateDogLocation(dog.id, updatedDog);
            onUpdate(data);
            setEditMode(false);
            alert("¡Ubicación actualizada correctamente!");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha desconocida";
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <>
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="detail-modal">
                    <button className="close-btn" onClick={onClose}>&times;</button>
                    <div className="detail-content">
                        <div className="detail-image-section">
                            <img src={dog.fotoUrl} alt={dog.nombre} className="detail-image" />
                        </div>
                        <div className="detail-info-section">
                            <h2>Detalles de {dog.nombre}</h2>
                            <p><strong>Raza:</strong> {dog.raza}</p>
                            <p><strong>Descripción:</strong> {dog.descripcion || "Sin descripción."}</p>
                            <p><strong>Dueño:</strong> {dog.nombrePropietario || "No especificado"}</p>
                            <p><strong>Reportado el:</strong> {formatDate(dog.fechaReporte)}</p>
                            
                            <p className="detail-location-text">
                                <strong>{editMode ? "Nuevo punto detectado:" : "Último avistamiento:"}</strong><br/>
                                {tempAddress || dog.ultimaDireccion}
                            </p>
                            <div className="detail-map-container">
                                <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <MapEvents />
                                    <RecenterMap coords={position} />
                                    <Marker position={position} />
                                </MapContainer>
                            </div>

                            {!editMode ? (
                                <button className="btn-update-view" onClick={handleButtonClick}>
                                    📍 Actualizar último avistamiento
                                </button>
                            ) : (
                                <div className="edit-actions">
                                    <button className="btn-confirm-loc" onClick={handleUpdateLocation}>Confirmar Cambio</button>
                                    <button className="btn-cancel-loc" onClick={() => setEditMode(false)}>Cancelar</button>
                                </div>
                            )}

                            {!editMode && (
                                <button className="btn-contact-owner" onClick={handleContactClick}>
                                    Contactar vía WhatsApp 📱
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <LoginModal 
                isVisible={isLoginModalVisible} 
                onClose={() => setIsLoginModalVisible(false)} 
            />
        </>
    );
};