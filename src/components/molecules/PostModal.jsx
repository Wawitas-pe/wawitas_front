import React, { useState } from 'react';

export const PostModal = ({ isVisible, onClose, onPublish }) => {
    const [formData, setFormData] = useState({ 
        titulo: '', 
        categoria: '', 
        contenido: '', 
        imagen: null 
    });
    const [preview, setPreview] = useState(null);

    if (!isVisible) return null;

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') onClose();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, imagen: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onPublish({
            nombre: formData.titulo,
            situacion: formData.categoria,
            descripcion: formData.contenido,
            fotoUrl: preview || 'https://placedog.net/800/400?id=blog'
        });
        setFormData({ titulo: '', categoria: '', contenido: '', imagen: null });
        setPreview(null);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-card">
                <button className="close-icon-btn" onClick={onClose}>&times;</button>
                <div className="modal-header-custom">
                    <h2>📝 Nueva Entrada al Blog</h2>
                </div>
                <form onSubmit={handleSubmit} className="modal-form-custom">
                    <div className="input-group">
                        <label>Título del post</label>
                        <input type="text" placeholder="Ej: Consejos de salud" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
                    </div>
                    
                    <div className="input-group">
                        <label>Categoría</label>
                        <input type="text" placeholder="Ej: Salud, Alimentación..." value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} required />
                    </div>

                    <div className="input-group">
                        <label>Contenido</label>
                        <textarea placeholder="¿De qué trata tu post?" value={formData.contenido} onChange={(e) => setFormData({...formData, contenido: e.target.value})} required></textarea>
                    </div>

                    <div className="input-group">
                        <label>Imagen (Opcional)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {preview && <img src={preview} alt="Vista previa" style={{ width: '100%', marginTop: '10px', borderRadius: '8px', maxHeight: '150px', objectFit: 'cover' }} />}
                    </div>
                    
                    <button type="submit" className="modal-submit-btn">Publicar en el Blog</button>
                </form>
            </div>
        </div>
    );
};