import React, { useEffect, useState } from 'react';
import DogService from '../services/DogService.jsx';
import './PantallaPerdidos.css';
import TextType from "../components/TextType.jsx";

// --- Componente de la Card ---
const DogCard = ({ dog }) => (
    <div className="dog-card">
        <img
            src={dog.imageUrl}
            alt={`Foto de ${dog.name}`}
            className="dog-image"
            onError={(e) => e.target.src = 'https://placedog.net/500/500'}
        />
        <div className="dog-info">
            <h3 className="dog-name">{dog.name}</h3>
            {/* ... otros detalles ... */}
            <p><strong>Ubicación:</strong> {dog.location}</p>
            <button className="contact-button">Ver Detalles / Contactar</button>
        </div>
    </div>
);


export const PantallaPerdidos = () =>{

    // 🔑 Estados para la lógica de datos
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lógica de carga de datos (queda igual)
    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const data = await DogService.getLostDogs();
                setDogs(data);
            } catch (err) {
                // 🛑 SOLO ASIGNAR EL ERROR, NO ROMPER EL RENDERIZADO
                setError(err.message || "Ocurrió un error desconocido al cargar los datos.");
                setDogs([]); // Asegurar que el array esté vacío
            } finally {
                setLoading(false);
            }
        };
        fetchDogs();
    }, []);

    const heroTextLines = [
        "¿Necesitas ayuda para encontrar a tu mascota?",
        "¡Estamos aquí para ayudarte!",
        "Dinos qué estás buscando..."
    ];

    return(
        <div className="inicio-container">

            {/* 🔑 1. SECCIÓN HERO: RENDERIZADO INCONDICIONAL */}
            {/* Esta sección siempre se muestra, independientemente del estado de la API */}
            <section className="hero-ayuda">
                <h1 className="ayuda-title">
                    <TextType
                        text={heroTextLines}
                        typingSpeed={70}
                        pauseDuration={1500}
                        loop={true}
                        showCursor={true}
                        cursorCharacter="|"
                    />
                </h1>

                <p>Completa el formulario a continuación para reportar una mascota perdida o encontrada.</p>

                <div className="search-filters">
                    <input type="text" placeholder="Buscar por nombre o raza..." />
                    <select><option>Todas las razas</option></select>
                </div>
            </section>

            {/* --- 2. SECCIÓN PRINCIPAL DE CARDS (Contenido condicional) --- */}
            <main className="ayuda-main-content">
                <h2> Perros Reportados Perdidos Recientemente </h2>

                {/* 🛑 AHORA MANEJAMOS LOS ESTADOS AQUÍ DENTRO: */}
                {loading ? (
                    <div className="loading-container">
                        <p>Cargando reportes de perros perdidos... 🐾</p>
                    </div>
                ) : error ? (
                    // Mostrar solo el mensaje de error en esta sección
                    <div className="error-container">
                        <p style={{color: 'red', fontWeight: 'bold'}}>
                            ¡Error de Conexión! No se pudo cargar la lista de perros: {error}
                        </p>
                        <p>Por favor, asegúrate de que el JSON Server esté corriendo.</p>
                    </div>
                ) : dogs.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay reportes de perros perdidos.</p>
                    </div>
                ) : (
                    // Mostrar la lista si todo está bien
                    <div className="cards-grid">
                        {dogs.map(dog => (
                            <DogCard key={dog.id} dog={dog} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};