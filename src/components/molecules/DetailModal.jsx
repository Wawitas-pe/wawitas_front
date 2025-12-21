import React from 'react';
import './DetailModal.css';

export const DetailModal = ({ isVisible, dog, onClose }) => {
    if (!isVisible || !dog) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <img 
                        src={dog.imageUrl} 
                        alt={dog.name} 
                        className="modal-dog-image"
                        onError={(e) => e.target.src = 'https://placedog.net/500/500'} 
                    />
                </div>

                <div className="modal-dog-info">
                    <h2 className="dog-name-detail">{dog.name}</h2>
                    <p className="dog-location-detail">📍 {dog.location}</p>
                    
                    <div className="details-grid">
                        <p><strong>Raza:</strong> {dog.breed}</p>
                    </div>

                    <div className="description-box">
                        <p>{dog.description}</p>
                    </div>

                    <div className="modal-actions">
                        <button className="contact-button-modal">
                            Contactar Dueño 🐾
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};