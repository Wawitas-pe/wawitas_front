import React from 'react';
// Rutas ajustadas según tu estructura de carpetas
import { Footer } from '../components/organisms/footer/Footer.jsx';
import { Header } from '../components/organisms/header/Header.jsx';
import { SimulatedMap } from './SimulatedMap'; 
import '../pages/PantallaInicio.css';
import './TuZona.css'; 

// Coordenadas de Lima, Perú
const LIMA_CENTER = [-12.0464, -77.0428]; 
const BRENHA_CENTER = [-12.0528, -77.0467]; 
const LIMA_CENTRO_CENTER = [-12.0503, -77.0378]; 

export const TuZona = () => {
    return (
        <div className="inicio-container">
            
            <Header />
            
            {/* Este div envuelve el contenido central para empujar el footer */}
            <div className="main-content-wrapper">
                {/* --- HERO SECTION --- */}
                <section className="hero-split-text tu-zona-hero">
                    <h1 className="main-title">
                        ¡Están más cerca de lo que crees!
                    </h1>
                    <p className="hero-subtitle">
                        Explora los mapas de calor para encontrar la mayor concentración de reportes de mascotas perdidas y en adopción cerca de ti.
                    </p>
                </section>
                
                {/* --- SECCIÓN DE MAPAS --- */}
                <main className="tu-zona-map-container">
                    {/* 1. Breña */}
                    <SimulatedMap 
                        title="📍 Breña, Lima" 
                        initialCenter={BRENHA_CENTER}
                        isMainMap={false}
                    />
                    
                    {/* 2. Tu Ubicación Actual */}
                    <SimulatedMap 
                        title="📌 Tu Ubicación Actual" 
                        initialCenter={LIMA_CENTER}
                        isMainMap={true}
                    />
                    
                    {/* 3. Lima Centro */}
                    <SimulatedMap 
                        title="🗺️ Lima Centro" 
                        initialCenter={LIMA_CENTRO_CENTER}
                        isMainMap={false}
                    />
                </main>
            </div>

            <Footer />

        </div>
    );
};