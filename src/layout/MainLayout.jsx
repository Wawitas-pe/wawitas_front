import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {Footer} from "../components/organisms/footer/Footer.jsx";
import {Header} from "../components/organisms/header/Header.jsx";
import {ReportModal} from "../components/molecules/ReportModal.jsx";

export const MainLayout = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        // El contenedor principal de la aplicación
        <div className="app-layout-container">


            <main className="main-content-wrapper">
                <Outlet />
            </main>



            <button
                className="floating-report-btn" // Debes definir estos estilos en tu CSS global
                onClick={() => setIsModalOpen(true)}
                title="Reportar un animal perdido o en peligro"
            >
                ➕ Reportar
            </button>


            <ReportModal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </div>
    );
};