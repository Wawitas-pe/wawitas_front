import React, { useState } from 'react';
import './EvaluacionAdoptante.css';

export const EvaluacionAdoptante = ({ solicitudId, usuarioNombre, perroNombre }) => {
    const [respuestas, setRespuestas] = useState({});
    const [enviando, setEnviando] = useState(false);

    const preguntas = [
        { id: 'frecuenciaCasa', texto: '¿Con qué frecuencia alguien está en casa durante el día?' },
        { id: 'espacioExterior', texto: '¿Con qué frecuencia el hogar queda vacío por más de 6 horas seguidas?' },
        { id: 'viajesFrecuentes', texto: '¿Con qué frecuencia estás disponible los fines de semana?' },
        { id: 'gastosVets', texto: '¿Con qué frecuencia dispones de tiempo para pasear a un perro?' },
        { id: 'compromisoVidassssss', texto: '¿Con qué frecuencia puedes atender necesidades inesperadas (enfermedad, emergencias)?' },
        { id: 'compromisoVidassss', texto: '¿Con qué frecuencia mantienes rutinas de alimentación y paseo?' },
        { id: 'compromisoVidas', texto: '¿Con qué frecuencia hay espacio suficiente para que un perro se mueva?' }
    ];

    const opciones = [
        { label: 'Muy a menudo', sub: '', pts: 20 },
        { label: 'A menudo', sub: '', pts: 15 },
        { label: 'A veces', sub: '', pts: 10 },
        { label: 'Rara vez', sub: '', pts: 5 },
        { label: 'Nunca', sub: '', pts: 0 }
    ];

    const handleChange = (preguntaId, puntos) => {
        setRespuestas({ ...respuestas, [preguntaId]: puntos });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const scoreFinal = Object.values(respuestas).reduce((a, b) => a + b, 0);
        
        // Lógica de estado
        let status = 'no_apto';
        if (scoreFinal >= 70) status = 'apto';
        else if (scoreFinal >= 40) status = 'entrevista_pendiente';

        alert(`Resultado: ${status} (${scoreFinal} pts)`);
        console.log("Enviando a bd_wawitas...", { solicitudId, scoreFinal, status });
    };

    return (
        <div className="evaluacion-card">
            <div className="btn-close">Wawitas</div>
            
            <header className="evaluacion-header">
                <h2>TEST DE ADOPCIÓN 🐾</h2>
                <p>Este test nos ayudará a saber si estás apto para poder adoptar una de nuestras mascotas.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <table className="test-table">
                    <thead>
                        <tr>
                            <th></th>
                            {opciones.map((opt, index) => (
                                <th key={index} className="column-header">
                                    {opt.label}
                                    <span className="sub-header">{opt.sub}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {preguntas.map((preg) => (
                            <tr key={preg.id} className="pregunta-row">
                                <td className="pregunta-texto">{preg.texto}</td>
                                {opciones.map((opt, index) => (
                                    <td key={index} className="radio-cell">
                                        <input 
                                            type="radio" 
                                            name={preg.id} 
                                            className="custom-radio"
                                            required
                                            onChange={() => handleChange(preg.id, opt.pts)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="btn-container">
                    <button type="submit" className="btn-evaluar-verde">
                        ENVIAR
                    </button>
                </div>
            </form>
        </div>
    );
};