// src/components/modals/ReportModal.jsx

import React, { useState } from 'react';
import './ReportModal.css'; // Debes crear los estilos para el modal

// Recibe dos props: isVisible (booleano) y onClose (función)
export const ReportModal = ({ isVisible, onClose }) => {
    // Estado para guardar los datos del formulario
    const [form, setForm] = useState({
        tipoAnimal: '',
        ubicacion: '',
        estaHerido: '',
        cantidad: '',
        nombre: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos a reportar:", form);

        // Aquí iría el llamado al servicio API para reportar el avistamiento

        alert("¡Avistamiento registrado con éxito! (Simulación)");

        // Limpiar el formulario y cerrar el modal
        setForm({
            tipoAnimal: '', ubicacion: '', estaHerido: '', cantidad: '', nombre: ''
        });
        onClose();
    };

    // Si el modal no es visible, no renderiza nada (optimización)
    if (!isVisible) return null;

    return (
        // Estilos del overlay (fondo oscuro)
        <div className="modal-overlay" onClick={onClose}>
            {/* Detenemos la propagación del clic para que el clic dentro del modal
        no cierre accidentalmente el modal al propagarse al overlay.
      */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header-section">
                    <h2 className="registro-title">🚨 Reportar Avistamiento</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <p className="modal-subtitle">Proporciona los datos del animal que has visto en la calle.</p>

                <form className="registro-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Tipo de Animal:</label>
                        <input type="text" name="tipoAnimal" className="form-input" placeholder="Ej: Perro, Gato..." value={form.tipoAnimal} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Ubicación (Lugar Exacto):</label>
                        <input type="text" name="ubicacion" className="form-input" placeholder="Ej: Parque Kennedy, Miraflores..." value={form.ubicacion} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>¿Estado (Herido/Asustado)?</label>
                        <input type="text" name="estaHerido" className="form-input" placeholder="Si / No / Cojea un poco..." value={form.estaHerido} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Cantidad:</label>
                        <input type="number" name="cantidad" className="form-input" placeholder="Ej: 1, 2..." value={form.cantidad} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Nombre/Descripción (Collar, Color):</label>
                        <input type="text" name="nombre" className="form-input" placeholder="Ej: Collar rojo, color marrón" value={form.nombre} onChange={handleChange} />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-registrar-form">Enviar Reporte</button>
                    </div>

                </form>
            </div>
        </div>
    );
};