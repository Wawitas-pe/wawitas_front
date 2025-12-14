import React, { useEffect, useState, useCallback } from 'react';
import PostService from '../services/PostService.jsx';
import './AyudaEncontrarlo.css';

// NOTA: LikeButton recibe una función de actualización del padre
const LikeButton = ({ post, toggleLike }) => {
    // Mantener estado local para la apariencia visual (optimista)
    const [isLiked, setIsLiked] = useState(false);

    const handleToggle = () => {
        const newLikeStatus = !isLiked;
        const newLikesCount = newLikeStatus ? post.likes + 1 : post.likes - 1;

        // Llama a la función del padre para interactuar con la API
        toggleLike(post.id, newLikesCount);

        // Actualiza el estado visual local
        setIsLiked(newLikeStatus);
    };

    return (
        <button
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleToggle}
            title={isLiked ? "Quitar Me Gusta" : "Dar Me Gusta/Upvote"}
        >
            <span role="img" aria-label="like">{isLiked ? '❤️' : '🤍'}</span>
            <span className="like-count">{post.likes}</span>
        </button>
    );
};


const CommentSection = React.memo(({ post, addComment }) => {
    const [commentText, setCommentText] = useState('');

    const handleAddComment = (e) => {
        e.preventDefault();
        if (commentText.trim() === '') return;

        const newComment = {
            user: 'Usuario Simulado',
            text: commentText.trim(),
            ubicacion: commentText.toLowerCase().includes('visto en') ? 'Ubicación mencionada' : null
        };

        // Llama a la función del padre para interactuar con la API
        addComment(post, newComment);
        setCommentText('');
    };

    return (
        <div className="post-comments-section">
            <h4 className="comments-title">Comentarios ({post.comentarios.length})</h4>
            {post.comentarios.map((comment, index) => (
                <div key={index} className="comment-item">
                    <p className="comment-text">
                        <strong>{comment.user}:</strong> {comment.text}
                    </p>
                    {comment.ubicacion && (
                        <span className="comment-location">📍 Visto en: {comment.ubicacion}</span>
                    )}
                </div>
            ))}

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
});


// ... PostModal (El código del Modal queda sin cambios, solo llama a onPublish)
const PostModal = ({ isVisible, onClose, onPublish }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        situacion: 'perdido',
        raza: '',
        descripcion: '',
        fotoUrl: 'https://placedog.net/500/500?id=25',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalFotoUrl = formData.fotoUrl.trim() === '' ? 'https://placedog.net/500/500?id=25' : formData.fotoUrl;
        onPublish({...formData, fotoUrl: finalFotoUrl});
        setFormData({
            nombre: '', situacion: 'perdido', raza: '', descripcion: '',
            fotoUrl: 'https://placedog.net/500/500?id=25',
        });
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Publicar un Reporte</h2>
                <p>Completa los datos de tu mascota perdida o en adopción.</p>

                <form onSubmit={handleSubmit} className="post-form">
                    <label>Nombre de la mascota:<input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></label>
                    <label>Situación:
                        <select name="situacion" value={formData.situacion} onChange={handleChange} required>
                            <option value="perdido">Perdido 💔</option>
                            <option value="encontrado">Encontrado 📢</option>
                            <option value="adopcion">En Adopción 🏡</option>
                        </select>
                    </label>
                    <label>Raza (ej. Labrador, Mestizo):<input type="text" name="raza" value={formData.raza} onChange={handleChange} /></label>
                    <label>Descripción / Detalles:<textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required></textarea></label>
                    <label>URL de la Foto:<input type="url" name="fotoUrl" value={formData.fotoUrl} onChange={handleChange} /></label>

                    <button type="submit" className="submit-post-btn">Publicar Reporte</button>
                </form>
            </div>
        </div>
    );
};
// -------------------------------------------------------------------

export const AyudaEncontrarlo = () => {
    const [posts, setPosts] = useState([]); // Inicia vacío, se llena con la API
    const [loading, setLoading] = useState(true); // Se inicia cargando
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null); // Nuevo estado para errores

    // 1. Efecto para obtener las publicaciones al montar
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Llama al servicio para obtener los datos
                const data = await PostService.getAllPosts();
                // Ordenar por ID descendente (asumiendo que ID más alto es más nuevo)
                setPosts(data.sort((a, b) => b.id - a.id));
            } catch (err) {
                setError("Error al cargar las publicaciones. ¿El JSON Server está encendido?");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // 2. Función para crear nuevo post (asíncrona)
    const handleNewPost = async (newPostData) => {
        setLoading(true);
        try {
            const postToCreate = {
                ...newPostData,
                fecha: new Date().toLocaleDateString('es-ES'),
                likes: 0,
                comentarios: [],
            };

            // Llama al servicio para crear el post en el backend
            const createdPost = await PostService.createPost(postToCreate);

            // Añadir el post devuelto por el servidor (ya tiene el ID)
            setPosts(prevPosts => [createdPost, ...prevPosts]);
        } catch (error) {
            setError("No se pudo publicar el reporte.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Función para añadir un comentario (asíncrona)
    const addCommentToPost = useCallback(async (post, newComment) => {
        // Optimista: Actualizar el estado local antes de la respuesta del servidor
        const updatedPost = {
            ...post,
            comentarios: [...post.comentarios, newComment],
        };

        setPosts(prevPosts =>
            prevPosts.map(p => p.id === post.id ? updatedPost : p)
        );

        try {
            // Llama al servicio para actualizar el array de comentarios en el servidor
            await PostService.addComment(updatedPost);
        } catch (error) {
            console.error("Fallo al añadir comentario:", error);
            setError("Error al añadir el comentario.");
            // Aquí podrías revertir el cambio si el error fuera crítico.
        }
    }, []);

    // 4. Función para manejar likes (asíncrona)
    const handleToggleLike = useCallback(async (postId, newLikesCount) => {

        // Optimista: Actualizar el estado local inmediatamente para mejor UX
        setPosts(prevPosts =>
            prevPosts.map(p => p.id === postId ? { ...p, likes: newLikesCount } : p)
        );

        try {
            // Llama al servicio para enviar el nuevo conteo de likes al servidor
            await PostService.updateLikes(postId, newLikesCount);
        } catch (error) {
            console.error("Fallo al actualizar likes:", error);
            setError("No se pudo actualizar el like.");
            // Si falla, podrías revertir el posts(prevPosts...)
        }

    }, []);


    return (
        <div className="pagina-container">

            <div className="title-container">
                <h2 className="page-title">FORO: AYUDA A ENCONTRARLOS 🚨</h2>
                <p className="page-subtitle">Reportes de mascotas perdidas y en adopción. ¡Comenta si los has visto!</p>
            </div>

            <main className="forum-feed">
                {error && <p className="error-message">{error}</p>}

                {loading ? (
                    <p className="loading-text">Cargando publicaciones... 🐾</p>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="forum-post">

                            {/* ... Renderizado del Post ... */}
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

                            <div className="post-body">
                                <p className="post-description">{post.descripcion}</p>
                            </div>

                            <div className="post-actions">
                                <LikeButton post={post} toggleLike={handleToggleLike} />
                                <span className="comment-count" title="Cantidad de Comentarios">
                                    💬 {post.comentarios.length} Comentarios
                                </span>
                            </div>

                            <CommentSection
                                post={post}
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

            <button
                className="floating-publish-btn"
                onClick={() => setIsModalOpen(true)}
                title="Publicar nuevo reporte"
            >
                ➕ Publica
            </button>

            <PostModal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPublish={handleNewPost}
            />

        </div>
    );
};