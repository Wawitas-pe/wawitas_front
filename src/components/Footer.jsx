import React from 'react';
import './Footer.css';
import LogoLoop from './LogoLoop'; // Importamos el componente de animación
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa'; // Importamos los iconos

export const Footer = () => {
  
  // Configuración de los logos para el Loop (Redes Sociales)
  const socialLogos = [
    { node: <FaFacebook color="#fff" />, title: "Facebook", href: "https://facebook.com" },
    { node: <FaInstagram color="#fff" />, title: "Instagram", href: "https://instagram.com" },
    { node: <FaTiktok color="#fff" />, title: "TikTok", href: "https://tiktok.com" },
    { node: <FaFacebook color="#fff" />, title: "Facebook", href: "https://facebook.com" },
    { node: <FaInstagram color="#fff" />, title: "Instagram", href: "https://instagram.com" },
    { node: <FaTiktok color="#fff" />, title: "TikTok", href: "https://tiktok.com" },
    { node: <FaFacebook color="#fff" />, title: "Facebook", href: "https://facebook.com" },
    { node: <FaInstagram color="#fff" />, title: "Instagram", href: "https://instagram.com" },
    { node: <FaTiktok color="#fff" />, title: "TikTok", href: "https://tiktok.com" },
  ];

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
        
        {/* AQUÍ REEMPLAZAMOS LOS ICONOS ESTÁTICOS POR LA ANIMACIÓN */}
        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto 30px auto' }}>
            <LogoLoop
                logos={socialLogos}
                speed={100}        // Velocidad de desplazamiento
                direction="left"   // Dirección
                logoHeight={28}    // Tamaño de los iconos
                gap={30}           // Espacio entre iconos
                hoverSpeed={0}     // Se detiene al pasar el mouse
                scaleOnHover={true} // Efecto de escala al pasar el mouse
                fadeOut={true}     // Efecto de desvanecimiento en los bordes
                fadeOutColor="#000000" // Color del desvanecimiento (negro para coincidir con el footer)
                ariaLabel="Redes Sociales"
            />
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