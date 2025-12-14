import React, { useState } from 'react';
// 🔑 Importar Link para evitar recargas y useLocation para saber la ruta actual
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import {LoginModal} from "../../molecules/LoginModal.jsx";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // 🛑 Reemplaza el useEffect que usaba window.location.pathname
    const location = useLocation(); // Hook de React Router

    // 🛑 NUEVO: Estado para el modal de Login
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // 🛑 NUEVA FUNCIÓN: Abre el modal
    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
    };

    const getActiveClass = (path) => {
        const currentPath = location.pathname; // Usamos el hook, que se actualiza automáticamente

        // El resto de la lógica de comparación puede quedarse:
        if (path === '/') {
            return currentPath === '/' ? 'active' : '';
        }
        return currentPath.startsWith(path) ? 'active' : '';
    };

    return (
        <header className="navbar">
            <div className="logo-section">
                {/* 🛑 USAR <Link> en lugar de <a> */}
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

                {/* 🛑 USAR <Link> en lugar de <a> */}
                <Link to="/" className={`nav-item ${getActiveClass('/')}`}>Home</Link>
                <Link to="/zona" className={`nav-item ${getActiveClass('/zona')}`}>Tu Zona</Link>
                <Link to="/ayuda" className={`nav-item ${getActiveClass('/ayuda')}`}>Ayuda a encontrarlos</Link>
                <Link to="/perdidos" className={`nav-item ${getActiveClass('/perdidos')}`}>Perdidos</Link>

            </nav>


            {/* 🛑 NUEVO BOTÓN: Iniciar Sesión (Abre el Modal) */}
            <button
                className="btn-secondary header-btn" // Usa una clase diferente si quieres otro estilo (ej: gris o blanco)
                onClick={handleLoginClick}
            >
                Iniciar Sesión
            </button>

            {/* Botón Registrar (Mantiene su propósito original de navegar a /registrar) */}
            <Link to="/registrar">
                <button className="btn-green header-btn">Registrar</button>
            </Link>

            {/* El modal se renderiza aquí, visible solo cuando isLoginModalOpen es true */}
            <LoginModal
                isVisible={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </header>
    );
};