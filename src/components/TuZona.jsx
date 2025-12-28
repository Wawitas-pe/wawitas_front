import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/organisms/header/Header.jsx';
import { SimulatedMap } from './SimulatedMap';
import AuthService from '../services/AuthService.jsx';
import { LoginModal } from './molecules/LoginModal.jsx';
import './TuZona.css';
import DogService from "../services/DogService.jsx";

export const TuZona = () => {
    const navigate = useNavigate();
    const [mapCenter, setMapCenter] = useState([-12.0464, -77.0428]);
    const [puntosReales, setPuntosReales] = useState([]);
    const [userCoords, setUserCoords] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Estados del Formulario
    const [direccionAvistamiento, setDireccionAvistamiento] = useState('');
    const [nombrePerro, setNombrePerro] = useState('');

    // Estado para el Pop-up de confirmación
    const [showConfirm, setShowConfirm] = useState(false);
    const [tempData, setTempData] = useState(null);

    const distritosFijos = [
        { id: 2, nombre: "San Miguel", coords: [-12.0758, -77.0902], icon: "🏘️" },
        { id: 3, nombre: "Santiago de Surco", coords: [-12.1453, -76.9936], icon: "🏢" },
        { id: 7, nombre: "Breña", coords: [-12.0587, -77.0529], icon: "🏠" }
    ];

    // Verificar autenticación
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            setIsLoginModalOpen(true);
        }
    }, []);

    const handleLoginClose = () => {
        setIsLoginModalOpen(false);
        const user = AuthService.getCurrentUser();
        if (!user) {
            navigate('/');
        }
    };

    const iniciarReporte = () => {
        if (!direccionAvistamiento || !nombrePerro) {
            return alert("Por favor completa el nombre y la dirección");
        }

        // Simulación de Geocoding (puedes integrarlo con una API si lo necesitas)
        // Por ahora, usaremos una confirmación simple.
        const user = AuthService.getCurrentUser();
        setTempData({
            user_id: user ? user.id : 0,
            nombre_perro: nombrePerro,
            direccion_texto: direccionAvistamiento,
            // Coordenadas simuladas o de un geocoder
            latitud: mapCenter[0] + (Math.random() - 0.5) * 0.01,
            longitud: mapCenter[1] + (Math.random() - 0.5) * 0.01,
        });
        setShowConfirm(true);
    };

    const confirmarEnvio = async () => {
        try {
            const sightingData = {
                fecha: new Date().toISOString(),
                direccion: tempData.direccion_texto,
                fotoEvidencia: null, // No se maneja en esta versión
                latitud: tempData.latitud,
                longitud: tempData.longitud
            };

            await DogService.registerSighting(sightingData);
            
            setPuntosReales(prev => [...prev, { lat: tempData.latitud, lng: tempData.longitud }]);
            setMapCenter([tempData.latitud, tempData.longitud]);
            
            setDireccionAvistamiento('');
            setNombrePerro('');
            setShowConfirm(false);
            alert("¡Avistamiento registrado!");
        } catch (error) {
            console.error("Error detallado:", error);
            alert("Error al conectar con el servidor.");
        }
    };

    const handleMyLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = [position.coords.latitude, position.coords.longitude];
                    setUserCoords(coords);
                    setMapCenter(coords);
                },
                (error) => {
                    console.error("Error GPS:", error);
                    if (error.code === error.PERMISSION_DENIED) {
                        alert("Has denegado el acceso a tu ubicación.");
                    } else {
                        alert("No pudimos obtener tu ubicación.");
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            alert("Tu navegador no soporta geolocalización.");
        }
    };

    const cargarUbicaciones = async () => {
        try {
            const data = await DogService.getLostCoords();
            const coords = data
                .filter(post => post.latitud && post.longitud)
                .map(post => ({ lat: parseFloat(post.latitud), lng: parseFloat(post.longitud) }));
            setPuntosReales(coords);
        } catch (error) { console.error("Error API al cargar", error); }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const coords = [position.coords.latitude, position.coords.longitude];
                    setUserCoords(coords);
                },
                (error) => console.error("Error GPS:", error),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
        cargarUbicaciones();
    }, []);

    return (
        <div className="tuzona-dashboard">
            <Header />
            
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h3>¿Confirmar Registro?</h3>
                        <p><strong>Perrito:</strong> {tempData.nombre_perro}</p>
                        <p className="address-text">{tempData.direccion_texto}</p>
                        <div className="modal-buttons">
                            <button className="btn-cancelar" onClick={() => setShowConfirm(false)}>Editar</button>
                            <button className="btn-confirmar" onClick={confirmarEnvio}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-layout">
                <main className="map-view">
                    <SimulatedMap 
                        initialCenter={mapCenter}
                        puntosExternos={puntosReales} 
                        miUbicacionActual={userCoords} 
                    />
                </main>

                <aside className="sidebar-locations">
                    <div className="sidebar-header">
                        <h2>🐾 Registrar Avistamiento</h2>
                    </div>

                    <div className="report-form">
                        <input 
                            type="text" 
                            placeholder="Nombre o descripción (ej: Perrito negro)" 
                            value={nombrePerro}
                            onChange={(e) => setNombrePerro(e.target.value)}
                            className="report-input"
                        />
                        <input 
                            type="text" 
                            placeholder="¿Dónde lo viste? (Calle, distrito)" 
                            value={direccionAvistamiento}
                            onChange={(e) => setDireccionAvistamiento(e.target.value)}
                            className="report-input"
                        />
                        <button onClick={iniciarReporte} className="btn-reportar">
                            Registrar
                        </button>
                    </div>

                    <div className="locations-list">
                        <div className="location-item" onClick={handleMyLocationClick}>
                            <span className="location-icon">🔵</span>
                            <h4>Mi ubicación actual</h4>
                        </div>
                        {distritosFijos.map((d) => (
                            <div key={d.id} className="location-item" onClick={() => setMapCenter(d.coords)}>
                                <span className="location-icon">{d.icon}</span>
                                <h4>{d.nombre}</h4>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            <LoginModal 
                isVisible={isLoginModalOpen} 
                onClose={handleLoginClose} 
            />
        </div>
    );
};