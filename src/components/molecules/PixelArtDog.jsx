import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/perro.gif';
import './PixelArtDog.css'; // IMPORTANTE: Importar los estilos aquí

export const PixelArtDog = ({ onRestrictedAction }) => {
    const navigate = useNavigate();

    const handleDogClick = () => {
        // Si se pasa onRestrictedAction, úsala. Si no, navega directo (fallback)
        if (onRestrictedAction) {
            onRestrictedAction(() => {
                navigate('/adopcion');
            });
        } else {
            navigate('/adopcion');
        }
    };

    return (
        <div className="pixel-dog-fixed" onClick={handleDogClick}>
            <div className="pixel-bubble-fixed">¡Adóptame!</div>
            <img
                src={logo}
                alt="Pixel Dog"
                className="pixel-dog-img-fixed"
            />
        </div>
    );
};