import React from 'react';
import CountUp from '../utils/CountUp.jsx';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import './PantallaInicio.css';

export const PantallaInicio = () => {
    return (
        <div className="inicio-container-principal">
            <Header />

            <main className="inicio-main-content">
                {/* 1. SECCIÓN PRINCIPAL (HERO) */}
                <section className="hero-section">
                    <div className="hero-text">
                        <h1 className="hero-title">WAWITAS</h1>
                        <p className="hero-description">
                            Uniendo corazones para que ninguna mascota se quede sin hogar. 
                            Nuestra plataforma conecta reportes de mascotas perdidas, 
                            consejos de cuidado y una comunidad lista para ayudar.
                        </p>
                    </div>

                    <div className="hero-image-container">
                        <div className="mustard-blob"></div>
                        <img
                            src="https://placedog.net/600/500"
                            alt="Grupo de perros felices"
                            className="hero-dogs"
                        />
                    </div>
                </section>

                {/* 2. SECCIÓN DE CONSEJOS (TIPS) */}
                <section className="tips-section">
                    <div className="tip-card">
                        <div className="tip-icon">🐾</div>
                        <div>
                            <h3>Guía de Bienestar Animal</h3>
                            <p>Descubre consejos expertos para mejorar la calidad de vida de tu mejor amigo.</p>
                        </div>
                    </div>
                    <div className="paw-decoration paw-1">🐾</div>
                    <div className="paw-decoration paw-2">🐾</div>
                </section>

                {/* 3. BARRA DE ESTADÍSTICAS */}
                <section className="stats-bar-wrapper">
                    <div className="stats-bar">
                        <div className="stat-item">
                            <h2>Mascotas</h2>
                            <p>Trabajamos cada día para que cada wawita regrese a casa sana y salva.</p>
                        </div>

                        <div className="divider"></div>

                        <div className="stat-item">
                            <h2>Bienestar</h2>
                            <p>Fomentamos la salud integral sin importar la raza o edad de tu mascota.</p>
                            <img src="https://placedog.net/50/50" alt="Icono salud" className="stat-icon" />
                        </div>

                        <div className="divider"></div>

                        <div className="stat-item yellow-card-integrated">
                            <img src="https://placedog.net/80/80" alt="Mascota Senior" className="yellow-card-img" />
                            <h3 className='Textone'>Segunda Oportunidad</h3>
                            <p className='Textone'>Nuestros amigos senior esperan por un hogar lleno de amor.</p>
                        </div>

                        <div className="divider"></div>

                        <div className="stat-counter">
                            <div className="green-circle">
                                <span className="number">
                                    <CountUp to={55} duration={4} />+
                                </span>
                                <span className="label">Perdidos</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. SECCIÓN NOSOTROS */}
                <section className="about-section">
                    <h2 className="section-title">NUESTRA MISIÓN</h2>
                    <div className="about-grid">
                        <div className="about-img-left">
                            <img src="https://placedog.net/400/500" alt="Mascota rescatada" />
                        </div>
                        <div className="about-content-right">
                            <div className="about-img-right">
                                <img src="https://placedog.net/400/300" alt="Comunidad ayudando" />
                            </div>
                            <div className="about-text">
                                <h3>Ellos merecen un final feliz</h3>
                                <p>
                                    Wawitas nació de la necesidad de centralizar la ayuda animal. 
                                    Creemos que la tecnología puede ser el puente más fuerte entre 
                                    una mascota perdida y su familia.
                                </p>
                                <button className="btn-green">Únete a la Comunidad</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};