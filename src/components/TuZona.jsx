import React, { useState, useEffect } from 'react';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import { SimulatedMap } from './SimulatedMap'; 
import PostService from '../services/PostService.jsx'; 
import './TuZona.css'; 

export const TuZona = () => {
    const [mapCenter, setMapCenter] = useState([-12.0464, -77.0428]);
    const [puntosReales, setPuntosReales] = useState([]);

    const distritos = [
        { id: 1, nombre: "Tu Zona (Centro de Lima)", coords: [-12.0489, -77.0365], icon: "📍" },
        { id: 2, nombre: "San Miguel", coords: [-12.0758, -77.0902], icon: "🏘️" },
        { id: 3, nombre: "Santiago de Surco", coords: [-12.1453, -76.9936], icon: "🏢" },
        { id: 4, nombre: "La Molina", coords: [-12.0786, -76.9112], icon: "🏢" },
        { id: 5, nombre: "San Isidro", coords: [-12.1037, -77.0341], icon: "🏢" },
        { id: 6, nombre: "San Juan de Miraflores", coords: [-12.1629, -76.9648], icon: "🏢" },
        { id: 7, nombre: "Breña", coords: [-12.0587, -77.0529], icon: "🏠" }
    ];

    useEffect(() => {
        const cargarUbicaciones = async () => {
            try {
                const data = await PostService.getAllPosts(); 
                const coords = data
                    .filter(post => post.latitud && post.longitud)
                    .map(post => ({ lat: post.latitud, lng: post.longitud }));
                setPuntosReales(coords);
            } catch (error) {
                console.error("Error al conectar con el API", error);
            }
        };
        cargarUbicaciones();
    }, []);

    return (
        <div className="tuzona-dashboard">
            <Header />
            <div className="dashboard-layout">
                <main className="map-view">
                    <SimulatedMap 
                        title="Explorador de Mascotas Perdidas" 
                        initialCenter={mapCenter}
                        isMainMap={true}
                        puntosExternos={puntosReales} 
                    />
                </main>

                <aside className="sidebar-locations">
                    <div className="sidebar-header">
                        <h2>Ubicaciones</h2>
                        <p>Selecciona un distrito para centrar el mapa</p>
                    </div>
                    <div className="locations-list">
                        {distritos.map((d) => (
                            <div 
                                key={d.id} 
                                className={`location-item ${mapCenter[0] === d.coords[0] ? 'active' : ''}`}
                                onClick={() => setMapCenter(d.coords)}
                            >
                                <span className="location-icon">{d.icon}</span>
                                <div className="location-info">
                                    <h4>{d.nombre}</h4>
                                    <p>Ver reportes activos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
            <Footer />
        </div>
    );
};