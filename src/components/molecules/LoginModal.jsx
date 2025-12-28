import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../services/AuthService'; 
import './LoginModal.css';

export const LoginModal = ({ isVisible, onClose, onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await AuthService.login(credentials);
            setCredentials({ email: '', password: '' });
            onClose();
            
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } catch (err) {
            setError(err.message || 'Credenciales incorrectas.');
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="login-overlay" onClick={onClose}>
            <div className="login-card" onClick={(e) => e.stopPropagation()}>
                
                <button className="login-close-x" onClick={onClose} disabled={loading}>&times;</button>

                <div className="login-header">
                    <div className="login-logo-circle">🐾</div>
                    <h2>¡Hola de nuevo!</h2>
                    <p>Ingresa para interactuar con la comunidad wawitera.</p>
                </div>

                {error && <div className="login-error-badge">{error}</div>}

                <form className="login-form-body" onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="ejemplo@correo.com"
                            value={credentials.email} 
                            onChange={handleChange} 
                            required 
                            disabled={loading} 
                        />
                    </div>

                    <div className="login-input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••"
                            value={credentials.password} 
                            onChange={handleChange} 
                            required 
                            disabled={loading} 
                        />
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? 'Validando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="login-divider">
                    <span>o</span>
                </div>

                <div className="login-footer-text">
                    <p>¿Aún no eres parte? <Link to="/registrar" onClick={onClose}>Regístrate aquí</Link></p>
                </div>
            </div>
        </div>
    );
};