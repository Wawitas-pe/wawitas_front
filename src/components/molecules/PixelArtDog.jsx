import React, { useState } from 'react';
import AuthService from '../../services/AuthService.jsx';
import { EvaluacionAdoptante } from './EvaluacionAdoptante.jsx';

export const PixelArtDog = () => {
    const [showTest, setShowTest] = useState(false);
    const user = AuthService.getCurrentUser();

    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-overlay-adoptante') {
            setShowTest(false);
        }
    };

    return (
        <>
            <div className="pixel-dog-fixed" onClick={() => setShowTest(true)}>
                <div className="pixel-bubble-fixed">¡Adóptame!</div>
                <img 
                    src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueGZ3bmZueGZ3bmZueGZ3bmZueGZ3bmZueGZ3bmZueGZ3JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7WIEVjXL8EH3O1mE/giphy.gif" 
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