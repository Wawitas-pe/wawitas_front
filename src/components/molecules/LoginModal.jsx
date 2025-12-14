import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../services/AuthService'; // 🛑 Importar el servicio
import './LoginModal.css';

export const LoginModal = ({ isVisible, onClose }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    // 🛑 Nuevos estados para manejo de UX
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => { // 🛑 Función Asíncrona
        e.preventDefault();
        setError(null); // Limpiar errores anteriores
        setLoading(true); // Activar el spinner

        try {
            // 🛑 1. Llamar al servicio de autenticación
            const authResponse = await AuthService.login(credentials);

            console.log("Login exitoso:", authResponse);

            // 2. Manejar el éxito: limpiar, cerrar y recargar/redirigir
            setCredentials({ email: '', password: '' });
            onClose();
            // 💡 Una buena práctica es recargar la página o redirigir al dashboard
            window.location.reload();

        } catch (err) {
            const errorMessage = err.message || 'Credenciales incorrectas.';
            setError(errorMessage);
            console.error('Fallo en el Login:', err);

        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content login-modal" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header-section">
                    <h2 className="login-title">Iniciar Sesión</h2>
                    <button className="modal-close-btn" onClick={onClose} disabled={loading}>&times;</button>
                </div>

                {/* 🛑 Muestra el mensaje de error si existe */}
                {error && <p className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

                <form className="login-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input type="email" id="email" name="email" className="form-input"
                               value={credentials.email} onChange={handleChange} required disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input type="password" id="password" name="password" className="form-input"
                               value={credentials.password} onChange={handleChange} required disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-login-form"
                        disabled={loading} // 🛑 Deshabilita el botón mientras carga
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>

                </form>

                <div className="login-footer">
                    <p>¿No tienes una cuenta?</p>
                    <Link to="/registrar" className="register-link" onClick={onClose}>
                        Regístrate aquí
                    </Link>
                </div>

            </div>
        </div>
    );
};