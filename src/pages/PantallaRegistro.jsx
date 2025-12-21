import React, { useState } from 'react';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import AuthService from '../services/AuthService';
import './PantallaRegistro.css';

export const PantallaRegistro = () => {
  const [form, setForm] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(form.password !== form.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    try {
      // Extraemos confirmPassword para no enviarlo al db.json
      const { confirmPassword, ...userData } = form;
      
      // Llamada al servicio que hace el POST a /users
      await AuthService.register(userData);
      
      alert("¡Registro exitoso! Los datos se han guardado en el db.json.");
      
      // Limpiamos el formulario
      setForm({ nombreCompleto: '', email: '', telefono: '', password: '', confirmPassword: '' });
      
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
          <p className="registro-subtitle">Únete a Wawitas y ayuda a más mascotas.</p>
          
          <form className="registro-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                name="nombreCompleto" 
                className="form-input" 
                placeholder="Ej: Juan Pérez"
                value={form.nombreCompleto} 
                onChange={handleChange} 
                required 
              />
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
              <label>Teléfono (Opcional)</label>
              <input 
                type="tel" 
                name="telefono" 
                className="form-input" 
                placeholder="987654321"
                value={form.telefono} 
                onChange={handleChange} 
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

            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input 
                type="password" 
                name="confirmPassword" 
                className="form-input" 
                placeholder="••••••••"
                value={form.confirmPassword} 
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