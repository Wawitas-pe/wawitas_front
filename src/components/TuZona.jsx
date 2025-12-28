import React, { useState, useEffect } from 'react';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import { SimulatedMap } from './SimulatedMap'; 
import PostService from '../services/PostService.jsx'; 
import './TuZona.css'; 

export const TuZona = () => {
    const [mapCenter, setMapCenter] = useState([-12.0464, -77.0428]);
    const [puntosReales, setPuntosReales] = useState([]);
    const [userCoords, setUserCoords] = useState(null);
    
    // Estados del Formulario (Simplificado)
    const [direccionAvistamiento, setDireccionAvistamiento] = useState('');
    const [nombrePerro, setNombrePerro] = useState('');
    
    // Estado para el Pop-up
    const [showConfirm, setShowConfirm] = useState(false);
    const [tempData, setTempData] = useState(null);

    const distritosFijos = [
        { id: 2, nombre: "San Miguel", coords: [-12.0758, -77.0902], icon: "🏘️" },
        { id: 3, nombre: "Santiago de Surco", coords: [-12.1453, -76.9936], icon: "🏢" },
        { id: 7, nombre: "Breña", coords: [-12.0587, -77.0529], icon: "🏠" }
    ];

    // PASO 1: Geocodificación y Apertura de Pop-up
    const iniciarReporte = () => {
        if (!direccionAvistamiento || !nombrePerro) return alert("Por favor completa el nombre y la dirección");

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: direccionAvistamiento }, (results, status) => {
            if (status === "OK") {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                
                setTempData({
                    user_id: 1, // IMPORTANTE: Asegúrate de que este ID sea válido en tu DB
                    nombre_perro: nombrePerro,
                    direccion_texto: results[0].formatted_address,
                    latitud: lat,
                    longitud: lng
                });
                setShowConfirm(true);
            } else {
                alert("No encontramos la dirección. Intenta ser más específico.");
            }
        });
    };

    // PASO 2: Confirmación y Envío Real
    const confirmarEnvio = async () => {
        try {
            // Ajusta estos nombres de campos según lo que reciba exactamente tu API
            const postData = {
                userId: tempData.user_id,
                title: `Avistamiento: ${tempData.nombre_perro}`,
                latitud: tempData.latitud,
                longitud: tempData.longitud,
                description: `Perrito visto en ${tempData.direccion_texto}`
            };

            const response = await PostService.createPost(postData);
            
            // Si el backend responde bien, agregamos al mapa de calor local
            setPuntosReales(prev => [...prev, { lat: tempData.latitud, lng: tempData.longitud }]);
            setMapCenter([tempData.latitud, tempData.longitud]);
            
            // Reset
            setDireccionAvistamiento('');
            setNombrePerro('');
            setShowConfirm(false);
            alert("¡Avistamiento registrado!");
        } catch (error) {
            console.error("Error detallado:", error);
            alert("Error al conectar con el servidor. Revisa la consola (F12).");
        }
    };

    useEffect(() => {
        // RECUPERAR UBICACIÓN DEL USUARIO (PUNTO AZUL)
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const coords = [position.coords.latitude, position.coords.longitude];
                    setUserCoords(coords);
                },
                (error) => console.error("Error GPS:", error),
                { enableHighAccuracy: true }
            );
        }

        const cargarUbicaciones = async () => {
            try {
                const data = await PostService.getAllPosts(); 
                const coords = data
                    .filter(post => post.latitud && post.longitud)
                    .map(post => ({ lat: parseFloat(post.latitud), lng: parseFloat(post.longitud) }));
                setPuntosReales(coords);
            } catch (error) { console.error("Error API al cargar", error); }
        };
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
                            placeholder="¿Dónde está? (Calle, número, distrito)" 
                            value={direccionAvistamiento}
                            onChange={(e) => setDireccionAvistamiento(e.target.value)}
                            className="report-input"
                        />
                        <button onClick={iniciarReporte} className="btn-reportar">
                            Ubicar en Mapa
                        </button>
                    </div>

                    <div className="locations-list">
                        <div className="location-item" onClick={() => userCoords && setMapCenter(userCoords)}>
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
            <Footer />
        </div>
    );
};