import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from "../components/organisms/footer/Footer.jsx";
import { Header } from "../components/organisms/header/Header.jsx";

export const MainLayout = () => {
    return (
        <div className="app-layout-container">
            <main className="main-content-wrapper">
                <Outlet />
            </main>
        </div>
    );
};