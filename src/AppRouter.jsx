import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importaciones de Páginas
import { AyudaEncontrarlo } from './pages/AyudaEncontrarlo.jsx';
import { PantallaInicio } from "./pages/PantallaInicio.jsx";
import { PantallaPerdidos } from "./pages/PantallaPerdidos.jsx";
import { PantallaRegistro } from "./pages/PantallaRegistro.jsx"; // IMPORTANTE: Añadir esta
import { LoginPage } from "./pages/LoginPage.jsx";

// Importaciones de Componentes y Layout
import { MainLayout } from "./layout/MainLayout.jsx";
import { TuZona } from "./components/TuZona.jsx";
import { EvaluacionAdoptante } from './components/molecules/EvaluacionAdoptante.jsx';

const AppRouter = () => {
    return (
        <Routes>
            {/* 1. RUTAS CON HEADER Y FOOTER (Usan MainLayout) */}
            <Route path="/" element={<MainLayout />}>
                {/* Home: "/" */}
                <Route index element={<PantallaInicio />} />

                {/* Ayuda: "/ayuda" */}
                <Route path="ayuda" element={<AyudaEncontrarlo />} />

                {/* Tu Zona: "/zona" */}
                <Route path="zona" element={<TuZona />} />

                {/* Perdidos: "/perdidos" */}
                <Route path="perdidos" element={<PantallaPerdidos />} />

                {/* 🛑 SOLUCIÓN: Agregamos la ruta "registrar" aquí para que use el Layout */}
                <Route path="registrar" element={<PantallaRegistro />} />

                <Route path="adopta" element={<EvaluacionAdoptante />} />
            </Route>

            {/* 2. RUTAS SIN HEADER/FOOTER */}
            <Route path="login" element={<LoginPage />} />
            
            {/* Error 404 */}
            <Route path="*" element={<div style={{padding: "100px", textAlign: "center"}}><h2>404</h2><p>Página no encontrada</p></div>} />
        </Routes>
    );
};

export default AppRouter;