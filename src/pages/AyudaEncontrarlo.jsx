import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PostService from '../services/PostService.jsx';
import AuthService from '../services/AuthService.jsx';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import { LoginModal } from '../components/molecules/LoginModal.jsx';
import { PostModal } from '../components/molecules/PostModal.jsx';
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

// Componente de Tendencias Dinámico
const TrendsSidebar = ({ posts }) => {
    const topTrends = useMemo(() => {
        // 1. Contar ocurrencias de cada categoría
        const counts = posts.reduce((acc, post) => {
            const cat = post.situacion || 'General';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        // 2. Convertir a array, ordenar de mayor a menor y tomar los 4 primeros
        return Object.entries(counts)
            .map(([category, count]) => ({
                category,
                tag: `#${category.replace(/\s+/g, '')}`,
                count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
    }, [posts]);

    return (
        <aside className="trends-sidebar">
            <div className="trends-container">
                <h3 className="trends-title">Tendencias actuales</h3>
                {topTrends.length > 0 ? (
                    topTrends.map((trend, index) => (
                        <div key={index} className="trend-item">
                            <span className="trend-category">Tendencia en {trend.category}</span>
                            <p className="trend-tag">{trend.tag}</p>
                            <span className="trend-count">{trend.count} {trend.count === 1 ? 'post' : 'posts'} publicados</span>
                        </div>
                    ))
                ) : (
                    <p className="loading-text" style={{fontSize: '0.8rem'}}>Aún no hay tendencias...</p>
                )}
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
        if (user) accion();
        else setIsLoginModalOpen(true);
    };

    const handleNewPost = async (newPostData) => {
        try {
            const created = await PostService.createPost({ 
                ...newPostData, 
                fecha: new Date().toLocaleDateString('es-ES'), 
                likes: 0, 
                comentarios: [],
                raza: "General" 
            });
            // Al agregar el post al estado, TrendsSidebar se actualizará solo
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

    const heroTextLines = ["¿Necesitas ayuda?", "¡Estamos aquí para ayudarte!"];

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
                                    <span className="post-status-badge">{(post.situacion || 'BLOG').toUpperCase()}</span>
                                    <h3 className="blog-post-title">{post.nombre}</h3>
                                    <p className="post-detail">📅 {post.fecha}</p>
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
                {/* Pasamos los posts al sidebar para calcular tendencias */}
                <TrendsSidebar posts={posts} />
            </div>
            <button className="floating-publish-btn" onClick={() => ejecutarAccionProtegida(() => setIsModalOpen(true))}>✍️</button>
            <PostModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} onPublish={handleNewPost} />
            <LoginModal isVisible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <Footer />
        </div>
    );
};