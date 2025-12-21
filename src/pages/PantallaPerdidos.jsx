import React, { useEffect, useState } from 'react';
import DogService from '../services/DogService.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import { Header } from '../components/organisms/header/Header.jsx';
import { DetailModal } from '../components/molecules/DetailModal.jsx';
import './PantallaPerdidos.css';
import TextType from "../components/TextType.jsx";

const DogCard = ({ dog, onOpenDetail }) => (
    <div className="dog-card">
        <img
            src={dog.imageUrl}
            alt={`Foto de ${dog.name}`}
            className="dog-image"
            onError={(e) => e.target.src = 'https://placedog.net/500/500'}
        />
        <div className="dog-info">
            <h3 className="dog-name">{dog.name}</h3>
            <p className="dog-location">📍 {dog.location}</p>
            {/* Se activa la función al hacer clic */}
            <button className="contact-button" onClick={() => onOpenDetail(dog)}>
                Ver Detalles / Contactar
            </button>
        </div>
    </div>
);

export const PantallaPerdidos = () => {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para el detalle
    const [selectedDog, setSelectedDog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const data = await DogService.getLostDogs();
                setDogs(data);
            } catch (err) {
                setDogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDogs();
    }, []);

    const handleOpenDetail = (dog) => {
        setSelectedDog(dog);
        setIsModalOpen(true);
    };

    const heroTextLines = ["¿Necesitas ayuda?", "¡Estamos aquí para ayudarte!"];

    return (
        <div className="perdidos-page-wrapper">
            <Header />

            <section className="hero-ayuda">
                <h1 className="ayuda-title">
                    <TextType text={heroTextLines} typingSpeed={70} pauseDuration={1500} loop={true} showCursor={true} />
                </h1>
                <p>Mural de reportes de la comunidad para encontrar a nuestras wawitas.</p>
            </section>

            <main className="ayuda-main-content">
                <h2 className="mural-title">Perros Reportados Perdidos Recientemente</h2>
                {loading ? (
                    <div className="loading-container"><p>Cargando reportes... 🐾</p></div>
                ) : (
                    <div className="cards-grid">
                        {/* Se pasa la función al componente DogCard */}
                        {dogs.map(dog => (
                            <DogCard key={dog.id} dog={dog} onOpenDetail={handleOpenDetail} />
                        ))}
                    </div>
                )}
                <Footer />
            </main>

            {/* Modal que muestra la info del db.json */}
            <DetailModal 
                isVisible={isModalOpen} 
                dog={selectedDog} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};