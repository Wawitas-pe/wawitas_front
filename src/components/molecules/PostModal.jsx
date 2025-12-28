import React, { useState } from 'react';
import './PostModal.css';

const CATEGORIAS = [
    { nombre: 'Adopción', color: '#FF6B6B' },
    { nombre: 'Educación', color: '#4ECDC4' },
    { nombre: 'Ayuda', color: '#FFE66D' },
    { nombre: 'Historias', color: '#FF9F43' },
    { nombre: 'Salud', color: '#54A0FF' },
    { nombre: 'Evento', color: '#A3CB38' }
];

export const CreatePostWidget = ({ onPublish, onRestrictedAction }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({ 
        titulo: '', 
        categoria: 'General', 
        contenido: '', 
        imagenUrl: '', // Cambiado de imagen (file) a imagenUrl (string)
        fechaEvento: '',
        lugarEvento: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));

    const handleExpand = () => {
        onRestrictedAction(() => {
            setIsExpanded(true);
        });
    };

    // Maneja el cambio de la URL y actualiza la vista previa automáticamente
    const handleUrlChange = (e) => {
        setFormData({ ...formData, imagenUrl: e.target.value });
    };

    const handleCancel = () => {
        setIsExpanded(false);
        setFormData({ 
            titulo: '', 
            categoria: 'General', 
            contenido: '', 
            imagenUrl: '', 
            fechaEvento: '', 
            lugarEvento: '' 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newPost = {
            usuarioId: user ? user.id : 0,
            titulo: formData.titulo,
            descripcion: formData.contenido,
            categoria: formData.categoria,
            // Enviamos la URL directamente
            fotoUrl: formData.imagenUrl || null, 
            fechaEvento: formData.categoria === 'Evento' && formData.fechaEvento ? new Date(formData.fechaEvento).toISOString() : null,
            lugarEvento: formData.categoria === 'Evento' ? formData.lugarEvento : null,
            refugioId: user && user.rol === 'refugio' ? user.id : null 
        };

        onPublish(newPost);
        handleCancel();
    };

    return (
        <div className={`create-post-card ${isExpanded ? 'expanded' : ''}`}>
            <div className="composer-header">
                <div className="composer-avatar">
                    {user ? user.nombre.charAt(0).toUpperCase() : '?'}
                </div>
                <input 
                    type="text" 
                    className="composer-trigger-input"
                    placeholder={`¿Qué está pasando, ${user ? user.nombre : 'invitado'}?`}
                    onClick={handleExpand}
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                />
            </div>

            {isExpanded && (
                <form onSubmit={handleSubmit} className="composer-body fade-in">
                    <textarea 
                        placeholder="Cuéntanos más detalles..." 
                        value={formData.contenido} 
                        onChange={(e) => setFormData({...formData, contenido: e.target.value})} 
                        required
                    ></textarea>

                    <div className="composer-options">
                        <label className="option-label">Categoría:</label>
                        <div className="category-chips">
                            {CATEGORIAS.map(cat => (
                                <button 
                                    key={cat.nombre}
                                    type="button"
                                    className={`chip-btn ${formData.categoria === cat.nombre ? 'active' : ''}`}
                                    style={{ 
                                        borderColor: cat.color,
                                        backgroundColor: formData.categoria === cat.nombre ? cat.color : 'transparent', 
                                        color: formData.categoria === cat.nombre ? 'white' : cat.color 
                                    }}
                                    onClick={() => setFormData({...formData, categoria: cat.nombre})}
                                >
                                    {cat.nombre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {formData.categoria === 'Evento' && (
                        <div className="event-fields-inline">
                            <input type="datetime-local" value={formData.fechaEvento} onChange={(e) => setFormData({...formData, fechaEvento: e.target.value})} required />
                            <input type="text" placeholder="📍 Lugar del evento" value={formData.lugarEvento} onChange={(e) => setFormData({...formData, lugarEvento: e.target.value})} required />
                        </div>
                    )}

                    <div className="composer-footer">
                        <div className="media-upload" style={{ width: '100%' }}>
                            <input 
                                type="text" 
                                className="url-input"
                                placeholder="🔗 Pega la URL de la imagen (jpg, png...)" 
                                value={formData.imagenUrl}
                                onChange={handleUrlChange} 
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </div>
                    </div>

                    {/* Vista previa automática si hay algo escrito en imagenUrl */}
                    {formData.imagenUrl && (
                        <div className="image-preview-container">
                            <img 
                                src={formData.imagenUrl} 
                                alt="Preview" 
                                onError={(e) => e.target.style.display = 'none'} // Oculta si la URL es inválida
                            />
                            <button type="button" onClick={() => setFormData({...formData, imagenUrl: ''})}>×</button>
                        </div>
                    )}

                    <div className="action-buttons" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancelar</button>
                        <button type="submit" className="publish-btn">Publicar</button>
                    </div>
                </form>
            )}
        </div>
    );
};