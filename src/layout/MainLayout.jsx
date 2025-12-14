import React, { useState } from 'react';
// 🔑 CLAVE: Outlet es donde se inyectarán los componentes de página
import { Outlet } from 'react-router-dom';
import {Footer} from "../components/organisms/footer/Footer.jsx";
import {Header} from "../components/organisms/header/Header.jsx";
import {ReportModal} from "../components/molecules/ReportModal.jsx";

export const MainLayout = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        // El contenedor principal de la aplicación
        <div className="app-layout-container">

            <Header />

            {/* 🛑 El contenido de la página actual se inyecta AQUÍ */}
            <main className="main-content-wrapper">
                <Outlet />
            </main>

            <Footer />

            {/* 🛑 NUEVO: Botón Flotante para Reportar */}
            <button
                className="floating-report-btn" // Debes definir estos estilos en tu CSS global
                onClick={() => setIsModalOpen(true)}
                title="Reportar un animal perdido o en peligro"
            >
                ➕ Reportar
            </button>

            {/* 🛑 NUEVO: Modal que se abre y se cierra */}
            <ReportModal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </div>
    );
};