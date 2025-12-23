import React, { useState } from 'react';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import AuthService from '../services/AuthService';
import './PantallaRegistro.css';

export const PantallaRegistro = () => {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        nombreCompleto: `${form.nombres} ${form.apellidos}`,
        email: form.email,
        password: form.password,
        rol: "usuario"
      };
      
      await AuthService.register(userData);
      
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setForm({ nombres: '', apellidos: '', email: '', password: '' });
      
    } catch (err) {
      alert("Error al registrar: " + err.message);
    }
  };

  return (
    <div className="pagina-container">
      <Header />
      <main className="registro-main">
        <div className="registro-card">
          <div className="registro-header-icon">🐾</div>
          <h2 className="registro-title">Crea tu Cuenta</h2>
          <p className="registro-subtitle">Únete a la comunidad de Wawitas.</p>
          
          <form className="registro-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                <label>Nombres</label>
                <input 
                    type="text" 
                    name="nombres" 
                    className="form-input" 
                    placeholder="Ingresa tus nombres"
                    value={form.nombres} 
                    onChange={handleChange} 
                    required 
                />
                </div>

                <div className="form-group">
                <label>Apellidos</label>
                <input 
                    type="text" 
                    name="apellidos" 
                    className="form-input" 
                    placeholder="Ingresa tus apellidos"
                    value={form.apellidos} 
                    onChange={handleChange} 
                    required 
                />
                </div>
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                name="email" 
                className="form-input" 
                placeholder="ejemplo@correo.com"
                value={form.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                name="password" 
                className="form-input" 
                placeholder="••••••••"
                value={form.password} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-registrar-form">Registrarme</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};