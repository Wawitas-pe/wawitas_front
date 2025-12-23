import React, { useState } from 'react';
import './EvaluacionAdoptante.css';

export const EvaluacionAdoptante = ({ solicitudId, usuarioNombre, perroNombre }) => {
    const [respuestas, setRespuestas] = useState({
        espacioSuficiente: '',
        tiempoDisponible: '',
        compromisoLargoPlazo: '',
        otrosAnimales: ''
    });

    const [enviando, setEnviando] = useState(false);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setRespuestas({ ...respuestas, [e.target.name]: e.target.value });
    };

    // Lógica para calcular el score basado en la BD (Decimal 5,2)
    const calcularScore = () => {
        let puntos = 0;
        if (respuestas.espacioSuficiente === 'si') puntos += 25;
        if (respuestas.tiempoDisponible === 'si') puntos += 25;
        if (respuestas.compromisoLargoPlazo === 'si') puntos += 30;
        if (respuestas.otrosAnimales === 'si') puntos += 20;
        return puntos.toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);

        const scoreFinal = calcularScore();
        
        // Determinar status_evaluacion según el score
        let statusEval = 'entrevista_pendiente';
        if (scoreFinal < 50) statusEval = 'no_apto';
        else if (scoreFinal >= 80) statusEval = 'apto';

        const evaluacionData = {
            solicitud_id: solicitudId, // FK a solicitudesAdopcion
            score_final: parseFloat(scoreFinal),
            status_evaluacion: statusEval,
            fecha_evaluacion: new Date().toISOString()
        };

        console.log("Enviando a BD bd_wawitas:", evaluacionData);

        // Aquí iría tu llamada al API (fetch/axios)
        // await api.post('/evaluaciones', evaluacionData);
        
        alert(`Evaluación completada. Resultado: ${statusEval} (${scoreFinal} pts)`);
        setEnviando(false);
    };

    return (
        <div className="evaluacion-card">
            <div className="evaluacion-header">
                <h2>Listo para Adoptar?</h2>
                <p><strong>Solicitante:</strong> {usuarioNombre}</p>
                <p><strong>Mascota:</strong> {perroNombre}</p>
                <small>ID Solicitud: #{solicitudId}</small>
            </div>

            <form onSubmit={handleSubmit} className="evaluacion-form">
                <div className="pregunta">
                    <label>¿Cuenta con espacio suficiente para la mascota?</label>
                    <select name="espacioSuficiente" required onChange={handleChange}>
                        <option value="">Seleccione...</option>
                        <option value="si">Sí, tiene patio o casa amplia</option>
                        <option value="no">No, espacio muy reducido</option>
                    </select>
                </div>

                <div className="pregunta">
                    <label>¿Tiene tiempo para paseos y cuidados diarios?</label>
                    <select name="tiempoDisponible" required onChange={handleChange}>
                        <option value="">Seleccione...</option>
                        <option value="si">Sí (más de 2 horas)</option>
                        <option value="no">No (menos de 1 hora)</option>
                    </select>
                </div>

                <div className="pregunta">
                    <label>¿Está de acuerdo con un compromiso de 10 a 15 años?</label>
                    <select name="compromisoLargoPlazo" required onChange={handleChange}>
                        <option value="">Seleccione...</option>
                        <option value="si">Totalmente de acuerdo</option>
                        <option value="no">No estoy seguro</option>
                    </select>
                </div>

                <button type="submit" className="btn-evaluar" disabled={enviando}>
                    {enviando ? 'Procesando...' : 'Finalizar Evaluación'}
                </button>
            </form>
        </div>
    );
};