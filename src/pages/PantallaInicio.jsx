import React from 'react';
// La única utilidad que se conserva, asegúrate de que la ruta sea correcta
import CountUp from '../utils/CountUp.jsx';
import './PantallaInicio.css';
// 🛑 ELIMINADAS: Header y Footer

export const PantallaInicio = () => {

    return (
        // Contenedor principal de la página (El Layout se encarga de lo demás)
        <div className="inicio-container">

            {/* 🛑 ELIMINADO: <Header /> */}

            {/* 1. SECCIÓN PRINCIPAL (HERO) */}
            <section className="hero-section">
                <div className="hero-text">
                    <h1 className="hero-title">WAWITAS</h1>
                    <p className="hero-description">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </p>
                </div>

                <div className="hero-image-container">
                    <div className="mustard-blob"></div>
                    <img
                        src="https://placedog.net/600/500"
                        alt="Grupo de perros"
                        className="hero-dogs"
                    />
                </div>
            </section>

            {/* 2. SECCIÓN DE CONSEJOS (TIPS) */}
            <section className="tips-section">
                <div className="tip-card">
                    <div className="tip-icon">🐾</div>
                    <div>
                        <h3>Como cuidar a tus mascotas</h3>
                        <p>Con nuestra ayuda podrás alargar mas la vida de tu pequeño</p>
                    </div>
                </div>
                <div className="paw-decoration paw-1">🐾</div>
                <div className="paw-decoration paw-2">🐾</div>
            </section>

            {/* 3. BARRA DE ESTADÍSTICAS (STATS BAR) */}
            <section className="stats-bar-wrapper">
                <div className="stats-bar">

                    <div className="stat-item">
                        <h2>Pet's</h2>
                        <p>Ayudanos a poder salvar mas vidas...</p>
                    </div>

                    <div className="divider"></div>

                    <div className="stat-item">
                        <h2>Razas</h2>
                        <p>No importa la raza sino su salud</p>
                        <img src="https://placedog.net/50/50" alt="Icono perro" className="stat-icon" />
                    </div>

                    <div className="divider"></div>

                    {/* RECTANGULO NARANJA */}
                    <div className="stat-item yellow-card-integrated">
                        <img src="https://placedog.net/80/80" alt="Golden" className="yellow-card-img" />
                        <h3 className='Textone'>Pet's Old</h3>
                        <p className='Textone'>Ellos esperan un nuevo dueño</p>
                    </div>

                    <div className="divider"></div>

                    {/* ICONO CIRCULAR VERDE */}
                    <div className="stat-counter">
                        <div className="green-circle">
                            <span className="number">
                                {/* Asegúrate de que la ruta de CountUp sea válida */}
                                <CountUp to={55} className="number" duration={4} separator="," />+
                            </span>
                            <span className="label">Rescatados</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* 5. CAJA DE INFORMACIÓN (INFO BOX) */}
            <section className="info-box-section">
                <div className="info-box">
                    <div className="info-title">
                        <h3>Pet's Old</h3>
                    </div>
                    <div className="info-text">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.</p>
                    </div>
                    <div className="info-img">
                        <img src="https://placedog.net/150/80" alt="Grupo pequeño" />
                    </div>
                </div>
            </section>

            {/* 4. SECCIÓN NOSOTROS */}
            <section className="about-section">
                <h2 className="section-title">NOSOTROS</h2>
                <div className="about-grid">
                    <div className="about-img-left">
                        <img src="https://placedog.net/400/500" alt="Pug Sentado" />
                    </div>

                    <div className="about-content-right">
                        <div className="about-img-right">
                            <img src="https://placedog.net/400/300" alt="Perro Orejón" />
                        </div>
                        <div className="about-text">
                            <h3>Ellos no son culpables</h3>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                            </p>
                            <button className="btn-green">Registrar</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🛑 ELIMINADO: <Footer /> */}

        </div>
    );
};