import React, { useState } from 'react';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import './PantallaRegistro.css';

export const PantallaRegistro = () => {
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
    console.log("Datos a registrar:", form);
    alert("¡Gracias por registrar el avistamiento! (Simulación)");
  };

  return (
    <div className="pagina-container">
      <Header />

      <main className="registro-main">
        <div className="registro-card">
          <h2 className="registro-title">Ayúdanos a Encontrarlo</h2>
          
          <form className="registro-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label>¿Qué animalito es?</label>
              <input 
                type="text" 
                name="tipoAnimal" 
                className="form-input" 
                placeholder="Ej: Perro, Gato..." 
                value={form.tipoAnimal}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>¿Dónde lo viste?</label>
              <input 
                type="text" 
                name="ubicacion" 
                className="form-input" 
                placeholder="Ej: Parque Kennedy, Miraflores..." 
                value={form.ubicacion}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>¿Está herido?</label>
              <input 
                type="text" 
                name="estaHerido" 
                className="form-input" 
                placeholder="Si / No / Cojea un poco..." 
                value={form.estaHerido}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>¿Cuántos viste?</label>
              <input 
                type="text" 
                name="cantidad" 
                className="form-input" 
                placeholder="Ej: 1, 2..." 
                value={form.cantidad}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>¿Tiene nombre? (Si lo sabes)</label>
              <input 
                type="text" 
                name="nombre" 
                className="form-input" 
                placeholder="Ej: Bobby" 
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-registrar-form">Registrar</button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};