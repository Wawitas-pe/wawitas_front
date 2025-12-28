import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import './Header.css';
import { LoginModal } from "../../molecules/LoginModal.jsx";
import logo from '../../../assets/logo.webp';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const location = useLocation();

    const user = AuthService.getCurrentUser();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
        setIsMenuOpen(false); // Cerrar menú al abrir modal
    };

    const handleLogout = () => {
        AuthService.logout();
        setIsMenuOpen(false);
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
                        src={logo}
                        alt="Logo Happy Pet"
                        className="logo-img"
                    />
                </Link>
            </div>

            <button className="menu-toggle" onClick={toggleMenu}>
                {isMenuOpen ? '✕' : '☰'}
            </button>

            <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/" className={`nav-item ${getActiveClass('/')}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/blog" className={`nav-item ${getActiveClass('/blog')}`} onClick={() => setIsMenuOpen(false)}>Blog</Link>
                <Link to="/perdidos" className={`nav-item ${getActiveClass('/perdidos')}`} onClick={() => setIsMenuOpen(false)}>Perdidos</Link>
                <Link to="/zona" className={`nav-item ${getActiveClass('/zona')}`} onClick={() => setIsMenuOpen(false)}>Tu Zona</Link>

                
                {/* Botones visibles solo en móvil dentro del menú */}
                <div className="mobile-only-actions" style={{display: window.innerWidth <= 900 ? 'block' : 'none', width: '100%', textAlign: 'center'}}>
                    {user ? (
                        <>
                            <p style={{marginBottom: '10px', color: '#666'}}>Hola, <strong>{user.nombre}</strong></p>
                            <button className="header-btn btn-secondary" onClick={handleLogout} style={{width: '80%'}}>Cerrar Sesión</button>
                        </>
                    ) : (
                        <button className="header-btn btn-green" onClick={handleLoginClick} style={{width: '80%'}}>Iniciar Sesión</button>
                    )}
                </div>
            </nav>

            {/* Acciones visibles en Desktop */}
            <div className="header-actions">
                {user ? (
                    <div className="user-nav-info">
                        <span className="welcome-text">Hola, <strong>{user.nombre}</strong> 🐾</span>
                        <button 
                            className="btn-secondary header-btn logout-btn" 
                            onClick={handleLogout}
                        >
                            Salir
                        </button>
                    </div>
                ) : (
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