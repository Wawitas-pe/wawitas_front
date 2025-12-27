import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import './Header.css';
import { LoginModal } from "../../molecules/LoginModal.jsx";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const location = useLocation();

    // Verificamos si hay sesión activa usando el AuthService
    const user = AuthService.getCurrentUser();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
    };

    const getActiveClass = (path) => {
        const currentPath = location.pathname;
        if (path === '/') {
            return currentPath === '/' ? 'active' : '';
        }
        return currentPath.startsWith(path) ? 'active' : '';
    };

    return (
        <header className="navbar">
            <div className="logo-section">
                <Link to="/" title="Volver al Inicio">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                        alt="Logo Happy Pet"
                        className="logo-img"
                    />
                </Link>
            </div>

            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>

            <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/" className={`nav-item ${getActiveClass('/')}`}>Home</Link>
                <Link to="/zona" className={`nav-item ${getActiveClass('/zona')}`}>Tu Zona</Link>
                <Link to="/ayuda" className={`nav-item ${getActiveClass('/ayuda')}`}>Blog Comunitario</Link>
                <Link to="/perdidos" className={`nav-item ${getActiveClass('/perdidos')}`}>Perdidos</Link>
                <Link to="/adopcion" className={`nav-item ${getActiveClass('/adopcion')}`}>Test-Adopcion</Link>
            </nav>

            <div className="header-actions">
                {user ? (
                    /* Si el usuario inició sesión, mostramos su nombre y botón de salir */
                    <div className="user-nav-info">
                        <span className="welcome-text">Hola, <strong>{user.nombre}</strong> 🐾</span>
                        <button 
                            className="btn-secondary header-btn logout-btn" 
                            onClick={() => AuthService.logout()}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    /* Si no hay sesión, el botón Iniciar Sesión ocupa el lugar principal */
                    <button
                        className="btn-green header-btn"
                        onClick={handleLoginClick}
                    >
                        Iniciar Sesión
                    </button>
                )}
            </div>

            <LoginModal
                isVisible={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </header>
    );
};