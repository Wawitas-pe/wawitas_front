import React from 'react';
import { Footer } from './organisms/footer/Footer.jsx';
import '../pages/PantallaInicio.css';
import './TuZona.css'; // Importamos el CSS específico
import { Header } from './organisms/header/Header.jsx';
import { SimulatedMap } from './SimulatedMap'; // ¡Importamos el nuevo componente de simulación!

// Coordenadas de Lima, Perú
const LIMA_CENTER = [-12.0464, -77.0428]; 
const BRENHA_CENTER = [-12.0528, -77.0467]; // Simulación Breña
const LIMA_CENTRO_CENTER = [-12.0503, -77.0378]; // Simulación Lima Centro

export const TuZona = () => {
    
    return(
        <div className="inicio-container">
            
            <Header />

            {/* --- HERO SECTION CON TEXTO ESTÁTICO --- */}
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
                
                {/* 1. MAPA SECUNDARIO (IZQUIERDA) - Breña */}
                <SimulatedMap 
                    title="📍 Breña, Lima" 
                    initialCenter={BRENHA_CENTER}
                    isMainMap={false}
                />
                
                {/* 2. MAPA PRINCIPAL (CENTRO) - Pide Ubicación */}
                <SimulatedMap 
                    title="📌 Tu Ubicación Actual" 
                    initialCenter={LIMA_CENTER}
                    isMainMap={true}
                />
                
                {/* 3. MAPA SECUNDARIO (DERECHA) - Lima Centro */}
                <SimulatedMap 
                    title="🗺️ Lima Centro" 
                    initialCenter={LIMA_CENTRO_CENTER}
                    isMainMap={false}
                />
            </main>
            
            <Footer />
            
        </div>
    );
};