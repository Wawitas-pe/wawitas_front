import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AyudaEncontrarlo } from './pages/AyudaEncontrarlo.jsx'; // Tu página

import {MainLayout} from "./layout/MainLayout.jsx";
import {PantallaInicio} from "./pages/PantallaInicio.jsx";
import {TuZona} from "./components/TuZona.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {PantallaPerdidos} from "./pages/PantallaPerdidos.jsx";

const AppRouter = () => {
    return (
        <Routes>

            {/* 🛑 RUTA MADRE: Usa el Layout */}
            <Route path="/" element={<MainLayout />}>

                {/* 1. RUTAS HIJAS (Se inyectan en el <Outlet /> del Layout) */}

                {/* Ruta Home (la ruta por defecto: "/") */}
                <Route index element={<PantallaInicio />} />

                {/* Ruta /Tuzona */}
                <Route path="ayuda" element={<AyudaEncontrarlo />} />

                {/* Ruta /ayuda */}
                <Route path="zona" element={<TuZona />} />

                {/* Puedes añadir más rutas anidadas aquí, por ejemplo, /perdidos */}
                <Route path="perdidos" element={<PantallaPerdidos />} />

            </Route>

            {/* 2. RUTAS NO-LAYOUT (Ej: Login, 404, que no usan Header/Footer) */}
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<div>404 No Encontrado</div>} />

        </Routes>
    );
};

export default AppRouter;