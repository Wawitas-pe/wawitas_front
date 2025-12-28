import React, { useState } from 'react';
import AuthService from '../../services/AuthService.jsx';
import { EvaluacionAdoptante } from './EvaluacionAdoptante.jsx';

// Pasamos onRestrictedAction como prop para usar la lógica del Blog
export const PixelArtDog = ({ onRestrictedAction }) => {
    const [showTest, setShowTest] = useState(false);
    const user = AuthService.getCurrentUser();

    const handleDogClick = () => {
        // Si hay login, ejecuta abrir el test. Si no, onRestrictedAction abre el login solo.
        onRestrictedAction(() => {
            setShowTest(true);
        });
    };

    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-overlay-adoptante') {
            setShowTest(false);
        }
    };

    return (
        <>
            {/* Ahora el clic está protegido */}
            <div className="pixel-dog-fixed" onClick={handleDogClick}>
                <div className="pixel-bubble-fixed">¡Adóptame!</div>
                <img 
                    src="https://i.pinimg.com/originals/ef/47/a2/ef47a2526fd70c2af475776196069aab.gif"
                    alt="Pixel Dog" 
                    className="pixel-dog-img-fixed"
                />
            </div>

            {showTest && (
                <div className="modal-overlay-adoptante" onClick={handleBackdropClick}>
                    <div className="modal-content-wrapper">
                        <button className="close-popup-btn" onClick={() => setShowTest(false)}>×</button>
                        <EvaluacionAdoptante 
                            solicitudId="adopcion-general"
                            usuarioNombre={user?.nombre || "Interesado"}
                            perroNombre="Wawita"
                            isOpen={showTest}
                            onClose={() => setShowTest(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};