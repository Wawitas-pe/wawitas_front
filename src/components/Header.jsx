import React, { useState } from 'react';
import './Header.css'; // Importamos sus estilos

export const Header = () => {
  // Estado para el menú hamburguesa en móviles
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="logo-section">
        {/* Al hacer clic en el logo, volvemos al inicio */}
        <a href="/" title="Volver al Inicio">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png" 
            alt="Logo Happy Pet" 
            className="logo-img" 
          />
        </a>
      </div>

      {/* Botón Hamburguesa (Visible solo en móvil) */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Navegación - Clase condicional para mostrar/ocultar en móvil */}
      <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <a href="/" className="nav-item active">Home</a>
        <a href="/Tuzona" className="nav-item">Tu Zona</a>
        <a href="/ayuda" className="nav-item">Ayuda a encontrarlos</a>
        
        {/* CORRECCIÓN: Nos aseguramos de que lleve a /PantallaPerdidos */}
        <a href="/perdidos" className="nav-item">Perdidos</a>
      </nav>

      <a href="/registrar">
  <button className="btn-green header-btn">Registrar</button>
</a>
    </header>
  );
};