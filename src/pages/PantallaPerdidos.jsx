import React, { useEffect, useState } from 'react';
import DogService from '../services/DogService.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import { Header } from '../components/organisms/header/Header.jsx';
import { DetailModal } from '../components/molecules/DetailModal.jsx';
import { ReportModal } from '../components/molecules/ReportModal.jsx';
import './PantallaPerdidos.css';
import TextType from "../components/TextType.jsx";

const obtenerUbiCorta = (ubi) => {
    if (!ubi) return "Ubicación no disponible";
    const partes = ubi.split(',');
    return partes.length >= 2 ? `${partes[0].trim()}, ${partes[1].trim()}` : ubi;
};

const DogCard = ({ dog, onOpenDetail }) => (
    <div className="dog-card">
        <img
            src={dog.fotoUrl}
            alt={`Foto de ${dog.nombre}`}
            className="dog-image"
            onError={(e) => e.target.src = 'https://placedog.net/500/500'}
        />
        <div className="dog-info">
            <h3 className="dog-name">{dog.nombre}</h3>
            <p className="dog-location">📍 {obtenerUbiCorta(dog.ultimaDireccion)}</p>
            <button className="contact-button" onClick={() => onOpenDetail(dog)}>
                Ver Detalles / Contactar
            </button>
        </div>
    </div>
);

export const PantallaPerdidos = () => {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDog, setSelectedDog] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

    const handleOpenDetail = async (dog) => {
        try {
            const details = await DogService.getLostDetails(dog.id);
            setSelectedDog(details);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error al obtener detalles:", error);
            setSelectedDog(dog);
            setIsModalOpen(true);
        }
    };

    const updateDogInList = (updatedDog) => {
        setDogs(dogs.map(d => d.id === updatedDog.id ? updatedDog : d));
        setSelectedDog(updatedDog);
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
                <button 
                    className="btn-reportar-mascota"
                    onClick={() => setIsReportModalOpen(true)}
                >
                    📢 Reportar Mascota Perdida
                </button>
            </section>
            <main className="ayuda-main-content">
                <h2 className="mural-title">Perros Reportados Perdidos Recientemente</h2>
                {loading ? (
                    <div className="loading-container"><p>Cargando reportes... 🐾</p></div>
                ) : (
                    <div className="cards-grid">
                        {dogs.map(dog => (
                            <DogCard key={dog.id} dog={dog} onOpenDetail={handleOpenDetail} />
                        ))}
                    </div>
                )}
                <Footer />
            </main>
            <DetailModal 
                isVisible={isDetailModalOpen} 
                dog={selectedDog} 
                onClose={() => setIsDetailModalOpen(false)} 
                onUpdate={updateDogInList}
            />
            <ReportModal 
                isVisible={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
            />
        </div>
    );
};