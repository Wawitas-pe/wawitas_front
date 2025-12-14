import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './Header'; 
import { Footer } from './Footer'; 
import './AyudaEncontrarlo.css'; 

// --- Datos Simulados del Foro (Tipo Publicación) ---
let INITIAL_POSTS_MOCK = [
    { 
        id: 1, 
        nombre: 'Kira 💔 (Perdida hace 3 días)', 
        situacion: 'perdido', 
        fotoUrl: 'https://placedog.net/500/500?id=10', 
        raza: 'Poodle Toy',
        descripcion: 'Kira se escapó por el Parque de la Amistad en Surco. Tiene un collar rojo. Es muy asustadiza, por favor, no la persigan.',
        fecha: '10/12/2025',
        likes: 154,
        comentarios: [
            { user: 'MariaG', text: '¡La vi esta mañana cerca del cruce de Av. Benavides! Estaba corriendo hacia el Mercado.', ubicacion: 'Benavides, Surco' },
            { user: 'JuanPerez', text: 'Compartido en mis grupos de WhatsApp. ¡Ánimo!', ubicacion: null },
            { user: 'SeguridadLima', text: 'Revisaremos nuestras cámaras en la zona. Mantente atenta.', ubicacion: null },
        ]
    },
    { 
        id: 2, 
        nombre: 'Rocky (En Adopción)', 
        situacion: 'adopcion', 
        fotoUrl: 'https://placedog.net/500/500?id=12', 
        raza: 'Mestizo',
        descripcion: 'Rocky es un perro adulto muy cariñoso, rescatado de la calle. Está castrado y listo para un hogar. ¡Solo adopción responsable!',
        fecha: '11/12/2025',
        likes: 89,
        comentarios: [
            { user: 'AnaVet', text: '¡Qué hermoso! ¿Cuántos años tiene aproximadamente?', ubicacion: null },
            { user: 'CarlosM', text: '¿Se lleva bien con otros perros?', ubicacion: null },
        ]
    },
    { 
        id: 3, 
        nombre: 'Chispita (Visto y Recogido)', 
        situacion: 'encontrado', 
        fotoUrl: 'https://placedog.net/500/500?id=13', 
        raza: 'Chihuahua',
        descripcion: 'Encontramos a esta pequeña temblando en un paradero de Miraflores. La tenemos a salvo. Buscamos a su dueño.',
        fecha: '09/12/2025',
        likes: 210,
        comentarios: [
            { user: 'DueñoOriginal', text: '¡Dios mío, esa es mi Chispita! Soy su dueño. ¿Podemos coordinar la entrega? ¡Mil gracias!', ubicacion: null },
            { user: 'Voluntario', text: '¡Qué gran noticia! ¡Final feliz!', ubicacion: null },
        ]
    },
    { 
        id: 4, 
        nombre: 'Luna 🌙', 
        situacion: 'perdido', 
        fotoUrl: 'https://placedog.net/500/500?id=14', 
        raza: 'Pastor Alemán',
        descripcion: 'Perdida en Pueblo Libre. Es grande y lleva un arnés azul. Recompensa ofrecida.',
        fecha: '12/12/2025',
        likes: 72,
        comentarios: [
             { user: 'VecinoPL', text: 'Vi un perro grande corriendo anoche por la Plaza de la Bandera. ¡Parecía asustado!', ubicacion: 'Plaza de la Bandera' },
        ]
    },
    { 
        id: 5, 
        nombre: 'Pelusa (Busca Casa)', 
        situacion: 'adopcion', 
        fotoUrl: 'https://placedog.net/500/500?id=15', 
        raza: 'Shih Tzu',
        descripcion: 'Rescatada de un criadero. Necesita un hogar tranquilo sin niños pequeños.',
        fecha: '13/12/2025',
        likes: 55,
        comentarios: []
    },
];
// ---------------------------------------------------------------


// Componente para manejar la lógica de los Likes
const LikeButton = ({ initialLikes }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);

    const toggleLike = () => {
        if (isLiked) {
            setLikes(prev => prev - 1);
        } else {
            setLikes(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    return (
        <button 
            className={`like-btn ${isLiked ? 'liked' : ''}`} 
            onClick={toggleLike}
            title={isLiked ? "Quitar Me Gusta" : "Dar Me Gusta/Upvote"}
        >
            <span role="img" aria-label="like">{isLiked ? '❤️' : '🤍'}</span>
            <span className="like-count">{likes}</span>
        </button>
    );
};


// Componente para manejar la adición de comentarios
const CommentSection = ({ postId, initialComments, addComment }) => {
    const [commentText, setCommentText] = useState('');
    
    const handleAddComment = (e) => {
        e.preventDefault();
        if (commentText.trim() === '') return;

        const newComment = {
            user: 'UsuarioX', // Usuario logueado simulado
            text: commentText.trim(),
            // Simulación de detección de ubicación si se menciona
            ubicacion: commentText.toLowerCase().includes('vi en') || commentText.toLowerCase().includes('visto en') ? 'Ubicación mencionada' : null
        };
        
        addComment(postId, newComment);
        setCommentText('');
    };

    return (
        <div className="post-comments-section">
            <h4 className="comments-title">Comentarios ({initialComments.length})</h4>
            {initialComments.map((comment, index) => (
                <div key={index} className="comment-item">
                    <p className="comment-text">
                        <strong>{comment.user}:</strong> {comment.text}
                    </p>
                    {comment.ubicacion && (
                        <span className="comment-location">📍 Visto en: {comment.ubicacion}</span>
                    )}
                </div>
            ))}
            
            {/* Formulario para añadir comentario */}
            <form onSubmit={handleAddComment} className="add-comment-form">
                <input 
                    type="text" 
                    placeholder="Añadir un comentario/avistamiento..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                />
                <button type="submit">Responder</button>
            </form>
        </div>
    );
};

// -------------------------------------------------------------------
// Componente Modal para Publicación
// -------------------------------------------------------------------
const PostModal = ({ isVisible, onClose, onPublish }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        situacion: 'perdido', // Default
        raza: '',
        descripcion: '',
        fotoUrl: 'https://placedog.net/500/500?id=25', // URL simulada por defecto
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Pequeña validación de URL para evitar URLs vacías si no quieren foto
        const finalFotoUrl = formData.fotoUrl.trim() === '' ? 'https://placedog.net/500/500?id=25' : formData.fotoUrl;

        onPublish({...formData, fotoUrl: finalFotoUrl});
        
        // Resetear el formulario después de publicar
        setFormData({
            nombre: '',
            situacion: 'perdido',
            raza: '',
            descripcion: '',
            fotoUrl: 'https://placedog.net/500/500?id=25',
        });

        onClose(); // Cerrar el modal después de publicar
    };

    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Publicar un Reporte</h2>
                <p>Completa los datos de tu mascota perdida o en adopción.</p>
                
                <form onSubmit={handleSubmit} className="post-form">
                    
                    <label>
                        Nombre de la mascota:
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </label>
                    
                    <label>
                        Situación:
                        <select name="situacion" value={formData.situacion} onChange={handleChange} required>
                            <option value="perdido">Perdido 💔</option>
                            <option value="encontrado">Encontrado 📢</option>
                            <option value="adopcion">En Adopción 🏡</option>
                        </select>
                    </label>

                    <label>
                        Raza (ej. Labrador, Mestizo):
                        <input type="text" name="raza" value={formData.raza} onChange={handleChange} />
                    </label>

                    <label>
                        Descripción / Detalles:
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required></textarea>
                    </label>

                    <label>
                        URL de la Foto: (Usaremos una por defecto si no pones)
                        <input type="url" name="fotoUrl" value={formData.fotoUrl} onChange={handleChange} />
                    </label>
                    
                    <button type="submit" className="submit-post-btn">
                        Publicar Reporte
                    </button>
                </form>
            </div>
        </div>
    );
};



// -------------------------------------------------------------------

export const AyudaEncontrarlo = () => {
    const [posts, setPosts] = useState(INITIAL_POSTS_MOCK);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal

    // Simulación de useEffect
    useEffect(() => {
        setLoading(false);
    }, []);
    
    // Función para manejar la publicación del nuevo post
    const handleNewPost = (newPostData) => {
        const newPost = {
            ...newPostData,
            id: Date.now(), // ID único basado en el tiempo
            fecha: new Date().toLocaleDateString('es-ES'),
            likes: 0,
            comentarios: [],
        };
        // Añadir el nuevo post al inicio del feed
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };
    
    // Función para añadir un comentario a un post específico
    const addCommentToPost = useCallback((postId, newComment) => {
        setPosts(prevPosts => 
            prevPosts.map(post => 
                post.id === postId 
                    ? { ...post, comentarios: [...post.comentarios, newComment] }
                    : post
            )
        );
    }, []);

    return (
        <div className="pagina-container">
            <Header />

            <div className="title-container">
                <h2 className="page-title">FORO: AYUDA A ENCONTRARLOS 🚨</h2>
                <p className="page-subtitle">Reportes de mascotas perdidas y en adopción. ¡Comenta si los has visto!</p>
            </div>

            <main className="forum-feed">
                {loading ? (
                    <p className="loading-text">Cargando publicaciones... 🐾</p>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="forum-post">
                            
                            {/* 1. SECCIÓN DE IMAGEN Y DETALLES PRINCIPALES */}
                            <div className="post-header">
                                <div className="post-image-wrapper">
                                    <img 
                                        src={post.fotoUrl} 
                                        alt={post.nombre}
                                        onError={(e) => e.target.src = 'https://placedog.net/500/500'} 
                                    />
                                </div>
                                <div className="post-info">
                                    <h3 className="post-name">{post.nombre}</h3>
                                    <p className="post-detail">🐶 **Raza:** {post.raza || 'Desconocida'}</p>
                                    <p className="post-detail">📅 **Fecha del Reporte:** {post.fecha}</p>
                                    <span className={`post-status-badge ${post.situacion}`}>
                                        {post.situacion.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            
                            {/* 2. CONTENIDO DEL POST */}
                            <div className="post-body">
                                <p className="post-description">{post.descripcion}</p>
                            </div>
                            
                            {/* 3. BARRA DE INTERACCIÓN (LIKES Y COMENTARIOS) */}
                            <div className="post-actions">
                                <LikeButton initialLikes={post.likes} />
                                <span className="comment-count" title="Cantidad de Comentarios">
                                    💬 {post.comentarios.length} Comentarios
                                </span>
                            </div>
                            
                            {/* 4. SECCIÓN DE COMENTARIOS ACTIVA */}
                            <CommentSection 
                                postId={post.id}
                                initialComments={post.comentarios}
                                addComment={addCommentToPost}
                            />

                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No hay publicaciones en el foro. ¡Sé el primero en reportar un avistamiento! 🐶</p>
                    </div>
                )}
            </main>

            <Footer />
            
            {/* BOTÓN FLOTANTE ESTÁTICO */}
            <button 
                className="floating-publish-btn" 
                onClick={() => setIsModalOpen(true)}
                title="Publicar nuevo reporte"
            >
                ➕ Publica
            </button>
            
            {/* MODAL DE PUBLICACIÓN */}
            <PostModal 
                isVisible={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onPublish={handleNewPost}
            />
            
        </div>
    );
};