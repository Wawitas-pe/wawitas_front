import React, { useState, useEffect } from 'react';
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
                            src={pugImg}
                            alt="Mascota principal"
                            className="hero-dogs"
                        />
                    </div>
                </section>

                <section className="tips-section">
                    <div className="tip-card">
                        <div className="tip-icon">🐾</div>
                        <div>
                            <h3>Guía de Bienestar Animal</h3>
                            <p>Descubre consejos expertos para mejorar la calidad de vida de tu mejor amigo.</p>
                        </div>
                    </div>
                </section>

                <section className="stats-bar-wrapper">
                    <div className="stats-bar">
                        <div className="stat-item">
                            <h2>Mascotas</h2>
                            <p>Trabajamos cada día para que cada wawita regrese a casa sana y salva.</p>
                            <img src={golden} alt="Icono salud" className="stat-icon" />
                        </div>

                        <div className="divider"></div>

                        <div className="stat-item">
                            <h2>Bienestar</h2>
                            <p>Fomentamos la salud integral sin importar la raza o edad de tu mascota.</p>
                            <img src={bulldog} alt="Icono salud" className="stat-icon" />
                        </div>

                        <div className="divider"></div>

                        <div className="stat-item yellow-card-integrated">
                            <img src={profdog} alt="Mascota Senior" className="yellow-card-img" />
                            <h3 className='Textone'>Segunda Oportunidad</h3>
                            <p className='Textone'>Nuestros amigos senior esperan por un hogar lleno de amor.</p>
                        </div>

                        <div className="divider"></div>

                        <div className="stat-counter">
                            <div className="green-circle">
                                <span className="number">
                                    {!loading && <CountUp to={lostCount} duration={3} />}
                                    {loading ? '...' : '+'}
                                </span>
                                <span className="label">Perdidos</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2 className="section-title">NUESTRA MISIÓN</h2>
                    <div className="about-grid">
                        <div className="about-img-left">
                            <img src={poster} alt="Mascota rescatada" />
                        </div>
                        <div className="about-content-right">
                            <div className="about-img-right">
                                <img src={inicio} alt="Comunidad ayudando" />
                            </div>
                            <div className="about-text">
                                <h2>Ellos merecen un final feliz</h2>
                                
                                <p>
                                    Wawitas nació de una necesidad profunda y urgente: centralizar la ayuda animal en un solo ecosistema digital eficiente. En un mundo donde los reportes de mascotas perdidas suelen dispersarse y perderse entre miles de publicaciones en redes sociales, nuestra plataforma surge como un faro de esperanza organizado. Entendemos que cada minuto cuenta cuando un miembro de la familia no regresa a casa, y por ello hemos diseñado un espacio donde la comunidad y la tecnología trabajan en perfecta sintonía para maximizar las posibilidades de un reencuentro.
                                </p>

                                <p>
                                    Creemos firmemente que la tecnología no debe ser fría, sino humana, actuando como el puente más fuerte y resistente entre una mascota desorientada y los brazos de su familia. A través de herramientas de geolocalización, bases de datos actualizadas en tiempo real y sistemas de alerta inteligentes, transformamos la angustia de la búsqueda en una estrategia comunitaria de rescate. No somos solo una aplicación; somos una red de seguridad diseñada para proteger a quienes no tienen voz pero nos brindan su amor incondicional.
                                </p>

                                <p>
                                    Nuestra misión va más allá de un simple registro de extravíos. Nos esforzamos por fomentar una cultura de bienestar y responsabilidad, donde cada "wawita" sea valorada como un ser sintiente que merece respeto y cuidados dignos. Al unir a rescatistas, voluntarios, refugios y dueños en una sola comunidad activa, estamos construyendo un futuro donde ninguna mascota tenga que enfrentar la soledad de las calles y donde cada historia de extravío tenga el cierre que todos anhelamos: un regreso seguro al calor del hogar.
                                </p>

                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};