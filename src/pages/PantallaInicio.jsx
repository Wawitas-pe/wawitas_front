import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CountUp from '../utils/CountUp.jsx';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import DogService from '../services/DogService.jsx';
import pugImg from '../assets/pug.png';
import bulldog from '../assets/bulldog.png';
import profdog from '../assets/profiledog.png';
import golden from '../assets/golden.png';
import inicio from '../assets/inicio.png';
import poster from '../assets/poster.png';
import './PantallaInicio.css';

export const PantallaInicio = () => {
    const [lostCount, setLostCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLostDogsCount = async () => {
            try {
                const data = await DogService.getLostDogs();
                setLostCount(data.length); 
            } catch (err) {
                setLostCount(0);
            } finally {
                setLoading(false);
            }
        };
        fetchLostDogsCount();
    }, []);

    return (
        <div className="inicio-container-principal">
            <Header />

            <main className="inicio-main-content">
                {/* --- HERO SECTION --- */}
                <section className="hero-section">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Uniendo Corazones, <br />
                            <span>Rescatando Familias</span>
                        </h1>
                        <p className="hero-description">
                            Tu comunidad para reportar mascotas perdidas, encontrar ayuda y promover el bienestar animal. Cada acción cuenta para que una wawita vuelva a casa.
                        </p>
                        <div className="hero-cta-buttons">
                            <Link to="/perdidos" className="btn btn-primary">Ver Mascotas Perdidas</Link>
                            <Link to="/blog" className="btn btn-secondary">Leer el Blog</Link>
                        </div>
                    </div>
                    <div className="hero-image-container">
                        <div className="blob-background"></div>
                        <img src={pugImg} alt="Perrito Pug sonriendo" className="hero-main-dog" />
                    </div>
                </section>

                {/* --- SERVICES/FEATURES SECTION --- */}
                <section className="features-section">
                    <div className="feature-card">
                        <div className="feature-img-wrapper">
                            <img src={golden} alt="Reportes" className="feature-img" />
                        </div>
                        <h3>Reportes y Alertas</h3>
                        <p>Publica una alerta de mascota perdida y notifica a la comunidad en tu zona al instante.</p>
                        <Link to="/perdidos" className="feature-link">Reportar ahora →</Link>
                    </div>
                    <div className="feature-card">
                        <div className="feature-img-wrapper">
                            <img src={profdog} alt="Adopción" className="feature-img" />
                        </div>
                        <h3>Adopción Responsable</h3>
                        <p>Encuentra a tu compañero ideal y dale una segunda oportunidad a una vida que lo necesita.</p>
                        <Link to="/adopcion" className="feature-link">Buscar mascota →</Link>
                    </div>
                    <div className="feature-card">
                        <div className="feature-img-wrapper">
                            <img src={bulldog} alt="Blog" className="feature-img" />
                        </div>
                        <h3>Blog Comunitario</h3>
                        <p>Aprende sobre cuidados, lee historias de éxito y comparte tus experiencias con otros.</p>
                        <Link to="/blog" className="feature-link">Ir al blog →</Link>
                    </div>
                </section>

                {/* --- STATS SECTION --- */}
                <section className="stats-section">
                    <div className="stat-item">
                        <span className="stat-number">
                            {!loading && <CountUp to={lostCount} duration={3} />}
                            {loading && '...'}
                        </span>
                        <span className="stat-label">Mascotas Buscadas</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            <CountUp to={124} duration={3} />
                        </span>
                        <span className="stat-label">Reencuentros Exitosos</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            <CountUp to={5000} duration={4} />+
                        </span>
                        <span className="stat-label">Miembros en la Comunidad</span>
                    </div>
                </section>

                {/* --- MISSION/ABOUT SECTION --- */}
                <section className="mission-section">
                    <div className="mission-grid">
                        <div className="mission-images">
                            <img src={poster} alt="Poster mascota" className="mission-img-1" />
                            <img src={inicio} alt="Comunidad" className="mission-img-2" />
                        </div>
                        <div className="mission-content">
                            <span className="mission-tagline">Nuestra Misión</span>
                            <h2>No solo son mascotas, son familia.</h2>
                            <p>
                                Wawitas nació para centralizar la ayuda animal en un solo ecosistema digital. Transformamos la angustia de la búsqueda en una estrategia comunitaria de rescate, usando la tecnología como un puente entre una mascota desorientada y su familia.
                            </p>
                            <p>
                                Fomentamos una cultura de bienestar y responsabilidad, donde cada "wawita" es valorada. Unimos a rescatistas, voluntarios y dueños para construir un futuro donde ninguna mascota enfrente la soledad de las calles.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};