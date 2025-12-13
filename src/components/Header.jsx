import React, { useState, useEffect } from 'react';
import './Header.css'; // Importamos sus estilos

export const Header = () => {
    // Estado para el menú hamburguesa en móviles
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Estado para guardar la ruta actual. Obtenemos el pathname al cargar el componente.
    // Usamos '/' como valor por defecto si no hay path (aunque en React/SPA siempre hay uno)
    const [currentPath, setCurrentPath] = useState('/');

    useEffect(() => {
        // Obtenemos la ruta actual (ej: '/', '/Tuzona', '/ayuda')
        // Esto funciona en un entorno SPA (Single Page Application) de React.
        setCurrentPath(window.location.pathname);
    }, []); // El array vacío asegura que solo se ejecute al montar

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    /**
     * Función que verifica si el path del enlace coincide con la ruta actual.
     * @param {string} path - La ruta del enlace (ej: '/', '/Tuzona').
     * @returns {string} - 'active' si es la ruta actual, o vacío.
     */
    const getActiveClass = (path) => {
        // Tratamiento especial para la ruta de inicio ('/'): 
        // Solo es 'active' si el path es EXACTAMENTE '/'
        if (path === '/') {
            return currentPath === '/' ? 'active' : '';
        }
        
        // Para las otras rutas, verificamos si la ruta actual empieza con el path del enlace
        // (esto maneja mejor subrutas si existieran, aunque para rutas exactas, '== path' también funciona)
        return currentPath.startsWith(path) ? 'active' : '';
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
                
                {/* Aplicamos la clase condicional a cada enlace: */}
                <a href="/" className={`nav-item ${getActiveClass('/')}`}>Home</a>
                <a href="/Tuzona" className={`nav-item ${getActiveClass('/Tuzona')}`}>Tu Zona</a>
                <a href="/ayuda" className={`nav-item ${getActiveClass('/ayuda')}`}>Ayuda a encontrarlos</a>
                <a href="/perdidos" className={`nav-item ${getActiveClass('/perdidos')}`}>Perdidos</a>
                
            </nav>

            <a href="/registrar">
                <button className="btn-green header-btn">Registrar</button>
            </a>
        </header>
    );
};