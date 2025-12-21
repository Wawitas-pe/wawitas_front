import React, { useEffect, useState, useCallback } from 'react';
import PostService from '../services/PostService.jsx';
import AuthService from '../services/AuthService.jsx';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import { LoginModal } from '../components/molecules/LoginModal.jsx';
import './AyudaEncontrarlo.css';
import TextType from "../components/TextType.jsx";

const LikeButton = ({ post, toggleLike, onRestrictedAction }) => {
    const [isLiked, setIsLiked] = useState(false);
    const handleToggle = () => {
        onRestrictedAction(() => {
            const newLikeStatus = !isLiked;
            const newLikesCount = newLikeStatus ? (post.likes || 0) + 1 : (post.likes || 0) - 1;
            toggleLike(post.id, newLikesCount);
            setIsLiked(newLikeStatus);
        });
    };
    return (
        <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleToggle}>
            <span role="img" aria-label="like">{isLiked ? '❤️' : '🤍'}</span>
            <span className="like-count">{post.likes || 0}</span>
        </button>
    );
};

const CommentSection = React.memo(({ post, addComment, onRestrictedAction }) => {
    const [commentText, setCommentText] = useState('');
    const handleAddComment = (e) => {
        e.preventDefault();
        onRestrictedAction(() => {
            if (commentText.trim() === '') return;
            const user = AuthService.getCurrentUser();
            addComment(post, { user: user.nombre, text: commentText.trim() });
            setCommentText('');
        });
    };
    return (
        <div className="post-comments-section">
            <h4 className="comments-title">Comentarios ({(post.comentarios || []).length})</h4>
            {(post.comentarios || []).map((comment, index) => (
                <div key={index} className="comment-item">
                    <p className="comment-text"><strong>{comment.user}:</strong> {comment.text}</p>
                </div>
            ))}
            <form onSubmit={handleAddComment} className="add-comment-form">
                <input type="text" placeholder="Escribe un comentario..." value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
});

const PostModal = ({ isVisible, onClose, onPublish }) => {
    const [formData, setFormData] = useState({ nombre: '', situacion: 'consejo', descripcion: '', fotoUrl: '', raza: 'General' });
    if (!isVisible) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalFoto = formData.fotoUrl.trim() || 'https://placedog.net/800/400?id=blog';
        onPublish({ ...formData, fotoUrl: finalFoto });
        setFormData({ nombre: '', situacion: 'consejo', descripcion: '', fotoUrl: '', raza: 'General' });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <button className="close-icon-btn" onClick={onClose}>&times;</button>
                <div className="modal-header-custom">
                    <h2>📝 Nueva Entrada al Blog</h2>
                    <p>Comparte historias o consejos con la comunidad.</p>
                </div>
                <form onSubmit={handleSubmit} className="modal-form-custom">
                    <div className="input-group">
                        <label>Título de la entrada</label>
                        <input type="text" placeholder="Ej: Mi primera adopción" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
                    </div>
                    <div className="input-group">
                        <label>Categoría</label>
                        <select value={formData.situacion} onChange={(e) => setFormData({...formData, situacion: e.target.value})}>
                            <option value="consejo">💡 Consejo</option>
                            <option value="exito">📖 Historia de Éxito</option>
                            <option value="evento">📅 Evento</option>
                            <option value="donacion">🤝 Solidaridad</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Contenido</label>
                        <textarea placeholder="Escribe aquí..." value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} required></textarea>
                    </div>
                    <div className="input-group">
                        <label>URL de Imagen (Opcional)</label>
                        <input type="url" placeholder="https://..." value={formData.fotoUrl} onChange={(e) => setFormData({...formData, fotoUrl: e.target.value})} />
                    </div>
                    <button type="submit" className="modal-submit-btn">Publicar en el Blog</button>
                </form>
            </div>
        </div>
    );
};

const TrendsSidebar = () => {
    const trends = [
        { category: "Salud Animal", tag: "#TipsDeHidratación", count: "1.2k" },
        { category: "Comunidad", tag: "#WawitasFelices", count: "856" },
        { category: "Eventos", tag: "#VacunaciónLima", count: "640" },
        { category: "Historias", tag: "#AdoptaUnSenior", count: "420" },
    ];

    return (
        <aside className="trends-sidebar">
            <div className="trends-container">
                <h3 className="trends-title">Tendencias para ti</h3>
                {trends.map((trend, index) => (
                    <div key={index} className="trend-item">
                        <span className="trend-category">Tendencia en {trend.category}</span>
                        <p className="trend-tag">{trend.tag}</p>
                        <span className="trend-count">{trend.count} lecturas</span>
                    </div>
                ))}
            </div>
            <div className="who-to-follow">
                <h3 className="trends-title">Quién seguir</h3>
                <div className="follow-item">
                    <img src="https://placedog.net/40/40?id=1" alt="Refugio" />
                    <div className="follow-info">
                        <p>Refugio Las Patitas</p>
                        <span>@patitas_ong</span>
                    </div>
                    <button className="follow-btn">Seguir</button>
                </div>
            </div>
        </aside>
    );
};

export const AyudaEncontrarlo = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        PostService.getAllPosts()
            .then(data => setPosts(data.sort((a, b) => b.id - a.id)))
            .catch(() => console.error("Error de conexión"))
            .finally(() => setLoading(false));
    }, []);

    const ejecutarAccionProtegida = (accion) => {
        const user = AuthService.getCurrentUser();
        if (user) {
            accion();
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleNewPost = async (newPostData) => {
        try {
            const created = await PostService.createPost({ 
                ...newPostData, 
                fecha: new Date().toLocaleDateString('es-ES'), 
                likes: 0, 
                comentarios: [] 
            });
            setPosts([created, ...posts]);
        } catch (e) { alert("Error al publicar"); }
    };

    const addCommentToPost = useCallback(async (post, newComment) => {
        const updated = { ...post, comentarios: [...(post.comentarios || []), newComment] };
        setPosts(prev => prev.map(p => p.id === post.id ? updated : p));
        await PostService.addComment(updated);
    }, []);

    const handleToggleLike = useCallback(async (postId, count) => {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: count } : p));
        await PostService.updateLikes(postId, count);
    }, []);

    return (
        <div className="pagina-container">
            <Header />
            <div className="title-container">
                <h2 className="page-title">BLOG COMUNITARIO 🐾</h2>
                <p className="page-subtitle">Historias y consejos para los amantes de las wawitas.</p>
            </div>
            <div className="forum-layout">
                <main className="forum-feed">
                    {loading ? <p className="loading-text">Cargando historias... 🐾</p> : 
                        posts.map(post => (
                            <div key={post.id} className="blog-card">
                                <div className="blog-header-image">
                                    <img src={post.fotoUrl} alt="blog" onError={(e) => e.target.src = 'https://placedog.net/800/400'} />
                                </div>
                                <div className="post-content-area">
                                    <span className={`post-status-badge status-${post.situacion}`}>
                                        {(post.situacion || 'BLOG').toUpperCase()}
                                    </span>
                                    <h3 className="blog-post-title">{post.nombre}</h3>
                                    <p className="post-detail">📅 {post.fecha} • 🏷️ {post.raza}</p>
                                    <p className="blog-post-excerpt">{post.descripcion}</p>
                                </div>
                                <div className="post-actions">
                                    <LikeButton post={post} toggleLike={handleToggleLike} onRestrictedAction={ejecutarAccionProtegida} />
                                    <span className="comment-count">💬 {(post.comentarios || []).length}</span>
                                </div>
                                <CommentSection post={post} addComment={addCommentToPost} onRestrictedAction={ejecutarAccionProtegida} />
                            </div>
                        ))
                    }
                </main>
                <TrendsSidebar />
            </div>
            <button className="floating-publish-btn" onClick={() => ejecutarAccionProtegida(() => setIsModalOpen(true))}>✍️</button>
            <PostModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} onPublish={handleNewPost} />
            <LoginModal isVisible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <Footer />
        </div>
    );
};