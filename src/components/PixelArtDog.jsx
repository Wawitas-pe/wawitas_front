import React, { useState } from 'react';
import { EvaluacionAdoptante } from '../pages/EvaluacionAdoptante.jsx';
import './PixelArtDog.css';

export const PixelArtDog = ({ post }) => {
  const [showTest, setShowTest] = useState(false);

  if (post.situacion?.toLowerCase() !== 'adopción') return null;

  return (
    <div className="pixel-dog-container">
      <div className="pixel-dog-wrapper" onClick={() => setShowTest(true)}>
        <div className="pixel-bubble">¡Adóptames!</div>

        {/* Pixel Art */}
        <div className="pixel-dog">
          <div className="ear left"></div>
          <div className="ear right"></div>

          <div className="head">
            <div className="eye left"></div>
            <div className="eye right"></div>
            <div className="snout"></div>
          </div>

          <div className="body"></div>

          <div className="leg l1"></div>
          <div className="leg l2"></div>
          <div className="leg l3"></div>
          <div className="leg l4"></div>

          <div className="tail"></div>
        </div>
      </div>

      <EvaluacionAdoptante
        solicitudId={post.id}
        usuarioNombre="Usuario Interesado"
        perroNombre={post.nombre}
        isOpen={showTest}
        onClose={() => setShowTest(false)}
      />
    </div>
  );
};
