import React from 'react';
import { Footer } from './Footer'; 
import './PantallaInicio.css'; // Asumo que usas este CSS para el layout
import './AyudaEncontrarlo.css'; // ¡Importamos el nuevo CSS!
import { Header } from './Header';
import TextType from './TextType'; 

// --- Datos de Perros Perdidos de Ejemplo ---
const lostDogs = [
    {
        id: 1,
        name: "Max",
        lostDate: "Hace 3 días",
        age: "2 años",
        breed: "Labrador Retriever",
        gender: "Macho",
        location: "Parque Central",
        imageUrl: "https://images.pexels.com/photos/733416/pexels-photo-733416.jpeg" // Placeholder
    },
    {
        id: 2,
        name: "Luna",
        lostDate: "Hace 1 semana",
        age: "5 meses",
        breed: "Beagle",
        gender: "Hembra",
        location: "Calle 15",
        imageUrl: "https://images.pexels.com/photos/33100775/pexels-photo-33100775.jpeg" // Placeholder
    },
    {
        id: 3,
        name: "Rocky",
        lostDate: "Ayer",
        age: "4 años",
        breed: "Pastor Alemán",
        gender: "Macho",
        location: "Colonia Roma",
        imageUrl: "https://images.pexels.com/photos/12646676/pexels-photo-12646676.jpeg" // Placeholder
    },
    {
        id: 4,
        name: "Coco",
        lostDate: "Hace 2 semanas",
        age: "7 años",
        breed: "French Poodle",
        gender: "Hembra",
        location: "Zona Residencial",
        imageUrl: "https://images.pexels.com/photos/7704620/pexels-photo-7704620.jpeg" // Placeholder
    },
    {
        id: 5,
        name: "Toby",
        lostDate: "Hace 5 días",
        age: "1 año",
        breed: "Golden Retriever",
        gender: "Macho",
        location: "Cerca del lago",
        imageUrl: "https://images.pexels.com/photos/10392555/pexels-photo-10392555.jpeg" // Placeholder
    },
    {
        id: 6,
        name: "Nala",
        lostDate: "Hace 10 días",
        age: "3 años",
        breed: "Chihuahua",
        gender: "Hembra",
        location: "Sector Industrial",
        imageUrl: "https://images.pexels.com/photos/1191000/pexels-photo-1191000.jpeg" // Placeholder
    },
];

// --- Componente de la Card (Para reutilizar) ---
const DogCard = ({ dog }) => (
    <div className="dog-card">
        <img src={dog.imageUrl} alt={`Foto de ${dog.name}`} className="dog-image" />
        <div className="dog-info">
            <h3 className="dog-name">{dog.name}</h3>
            <p><strong>Raza:</strong> {dog.breed}</p>
            <p><strong>Edad:</strong> {dog.age}</p>
            <p><strong>Género:</strong> {dog.gender}</p>
            <p className="lost-details">
                <span className="lost-status">¡Perdido!</span>
                <span className="lost-time">{dog.lostDate}</span>
            </p>
            <p><strong>Ubicación:</strong> {dog.location}</p>
            <button className="contact-button">Ver Detalles / Contactar</button>
        </div>
    </div>
);


export const AyudaEncontrarlo = () =>{
    
    // Define las líneas de texto que TextType animará
    const heroTextLines = [
        "¿Necesitas ayuda para encontrar a tu mascota?", 
        "¡Estamos aquí para ayudarte!",
        "Dinos qué estás buscando..."
    ];
    
    return(
        <div className="inicio-container">
            
            <Header />

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
                {/* Aquí puedes añadir un formulario o filtros de búsqueda */}
                <div className="search-filters">
                    {/* Filtros o barra de búsqueda irían aquí */}
                    <input type="text" placeholder="Buscar por nombre o raza..." />
                    <select><option>Todas las razas</option></select>
                </div>
            </section>
            
            {/* --- SECCIÓN PRINCIPAL DE CARDS --- */}
            <main className="ayuda-main-content">
                <h2>🐕 Perros Reportados Perdidos Recientemente 💔</h2>
                
                <div className="cards-grid">
                    {/* Mapeamos el array para renderizar todas las cards */}
                    {lostDogs.map(dog => (
                        <DogCard key={dog.id} dog={dog} />
                    ))}
                    
                    {/* Repetimos para simular muchas cards */}
                    {lostDogs.map(dog => (
                        <DogCard key={`r1-${dog.id}`} dog={{...dog, id: `r1-${dog.id}`}} />
                    ))}
                    {lostDogs.map(dog => (
                        <DogCard key={`r2-${dog.id}`} dog={{...dog, id: `r2-${dog.id}`}} />
                    ))}
                </div>
            </main>
            {/* ---------------------------------- */}
            
            <Footer />
            
        </div>
    );
};

// Exportamos AyudaEncontrarlo al final del archivo si es necesario.
// export default AyudaEncontrarlo;