import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DetailModal.css';
import DogService from '../../services/DogService.jsx';
import { LoginModal } from './LoginModal.jsx'; // Asegúrate de importar tu modal de Login

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

    const position = tempCoords ? [tempCoords.lat, tempCoords.lng] : (dog.coords ? [dog.coords.lat, dog.coords.lng] : [-12.0463, -77.0427]);

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
                location: tempAddress || dog.location,
                coords: tempCoords || dog.coords
            };
            const data = await DogService.updateDogLocation(dog.id, updatedDog);
            onUpdate(data);
            setEditMode(false);
            alert("¡Ubicación actualizada correctamente!");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="detail-modal">
                    <button className="close-btn" onClick={onClose}>&times;</button>
                    <div className="detail-content">
                        <div className="detail-image-section">
                            <img src={dog.imageUrl} alt={dog.name} className="detail-image" />
                        </div>
                        <div className="detail-info-section">
                            <h2>Detalles de {dog.name}</h2>
                            <p><strong>Raza:</strong> {dog.breed}</p>
                            <p><strong>Descripción:</strong> {dog.description || "Sin descripción."}</p>
                            <p className="detail-location-text">
                                <strong>{editMode ? "Nuevo punto detectado:" : "Último avistamiento:"}</strong><br/>
                                {tempAddress || dog.location}
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

                            {!editMode && <button className="btn-contact-owner">Contactar vía WhatsApp 📱</button>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Login que aparece si no hay sesión al presionar el botón */}
            <LoginModal 
                isVisible={isLoginModalVisible} 
                onClose={() => setIsLoginModalVisible(false)} 
            />
        </>
    );
};