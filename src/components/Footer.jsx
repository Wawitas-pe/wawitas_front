import React from 'react';
import './Footer.css'; // Importamos sus propios estilos

export const Footer = () => {
  return (
    <footer className="footer-black">
      <div className="footer-content">
        
        {/* Logo con clase responsiva */}
        <div className="logo-footer">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png" 
            alt="Logo Happy Pet" 
            className="footer-logo" 
          />
        </div>
        
        <div className="social-links">
           <span>f</span> <span>✉</span> <span>in</span> <span>t</span>
        </div>

        <div className="donation-buttons">
           <button>AYUDA CON PLATA</button>
           <button>AYUDA CON PLATA</button>
           <button>AYUDA CON PLATA</button>
        </div>

        <div className="contact-details">
           <p>📞 +51 956 364 825</p>
           <small>@ COPYRIGHT WAWITAS</small>
           <small className="designer-credit">DESIGN BANANIN AND FAMBRICIO</small>
        </div>
      </div>
    </footer>
  );
};