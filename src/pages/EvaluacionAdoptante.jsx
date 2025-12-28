import React, { useState, useEffect } from 'react';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import './EvaluacionAdoptante.css';

export const EvaluacionAdoptante = () => {
    const [respuestas, setRespuestas] = useState({});
    const [isDirty, setIsDirty] = useState(false); // Estado para saber si hay cambios sin guardar

    const preguntas = [
        { id: 'frecuenciaCasa', texto: '¿Con qué frecuencia alguien está en casa durante el día?' },
        { id: 'espacioExterior', texto: '¿Con qué frecuencia el hogar queda vacío por más de 6 horas seguidas?' },
        { id: 'viajesFrecuentes', texto: '¿Con qué frecuencia estás disponible los fines de semana?' },
        { id: 'gastosVets', texto: '¿Con qué frecuencia dispones de tiempo para pasear a un perro?' },
        { id: 'compromisoEmergencia', texto: '¿Con qué frecuencia puedes atender necesidades inesperadas (enfermedad, emergencias)?' },
        { id: 'rutinas', texto: '¿Con qué frecuencia mantienes rutinas estables de alimentación y paseo?' },
        { id: 'espacioMovimiento', texto: '¿Con qué frecuencia hay espacio suficiente para que un perro se mueva libremente?' },
        // Nuevas preguntas
        { id: 'acuerdoFamiliar', texto: '¿Todos los miembros de la familia están de acuerdo con la adopción?' },
        { id: 'paciencia', texto: '¿Tienes paciencia para enseñar al perro si hace travesuras o rompe algo?' }
    ];

    const opciones = [
        { label: 'Siempre / Muy a menudo', pts: 20 },
        { label: 'A menudo', pts: 15 },
        { label: 'A veces', pts: 10 },
        { label: 'Rara vez', pts: 5 },
        { label: 'Nunca', pts: 0 }
    ];

    // Efecto para advertir si intenta salir de la página (recargar/cerrar)
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; // Estándar para navegadores modernos
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleChange = (preguntaId, puntos) => {
        setRespuestas({ ...respuestas, [preguntaId]: puntos });
        setIsDirty(true); // Marcamos que hay cambios
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar que todas las preguntas estén respondidas
        if (Object.keys(respuestas).length < preguntas.length) {
            alert("Por favor responde todas las preguntas antes de enviar.");
            return;
        }

        const scoreFinal = Object.values(respuestas).reduce((a, b) => a + b, 0);
        
        // Lógica de estado
        let status = 'no_apto';
        if (scoreFinal >= 140) status = 'apto'; // Ajustado por las nuevas preguntas
        else if (scoreFinal >= 80) status = 'entrevista_pendiente';

        setIsDirty(false); // Limpiamos el estado "sucio" para que no salga la alerta
        alert(`Gracias por completar el test.\nResultado preliminar: ${status.toUpperCase().replace('_', ' ')} (${scoreFinal} pts)`);
        // Aquí iría la lógica de envío al backend
    };

    return (
        <div className="evaluacion-page-wrapper">
            <Header />
            <main className="evaluacion-main-content">
                <div className="evaluacion-card">
                    <header className="evaluacion-header">
                        <h2>TEST DE ADOPCIÓN 🐾</h2>
                        <p>Queremos asegurarnos de que tú y tu futura mascota sean la pareja perfecta. Sé honesto con tus respuestas.</p>
                    </header>

                    <form onSubmit={handleSubmit}>
                        <table className="test-table">
                            <thead>
                                <tr>
                                    <th>Pregunta</th>
                                    {opciones.map((opt, index) => (
                                        <th key={index} className="column-header">
                                            {opt.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preguntas.map((preg) => (
                                    <tr key={preg.id} className="pregunta-row">
                                        <td className="pregunta-texto">{preg.texto}</td>
                                        {opciones.map((opt, index) => (
                                            <td key={index} className="radio-cell" onClick={() => handleChange(preg.id, opt.pts)}>
                                                <div className={`custom-radio-wrapper ${respuestas[preg.id] === opt.pts ? 'selected' : ''}`}>
                                                    <div className="radio-circle"></div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="btn-container">
                            <button type="submit" className="btn-evaluar-verde">
                                ENVIAR RESULTADOS
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};