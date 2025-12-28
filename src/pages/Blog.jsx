import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PostService from '../services/PostService.jsx';
import AuthService from '../services/AuthService.jsx';
import { Header } from '../components/organisms/header/Header.jsx';
import { Footer } from '../components/organisms/footer/Footer.jsx';
import { LoginModal } from '../components/molecules/LoginModal.jsx';
import { CreatePostWidget } from '../components/molecules/PostModal.jsx'; // Importamos el nuevo widget
import { PixelArtDog } from '../components/molecules/PixelArtDog.jsx';
import './Blog.css';

// --- COMPONENTES AUXILIARES ---
const LikeButton = ({ post, toggleLike, onRestrictedAction }) => {
    const [isLiked, setIsLiked] = useState(false);
    const handleToggle = () => {
        onRestrictedAction(() => {
            const newLikeStatus = !isLiked;
            const newLikesCount = newLikeStatus ? (post.cantidad_Likes || 0) + 1 : (post.cantidad_Likes || 0) - 1;
            toggleLike(post.post_Id, newLikesCount);
            setIsLiked(newLikeStatus);
        });
    };
    return (
        <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleToggle}>
            <span role="img" aria-label="like">{isLiked ? '❤️' : '🤍'}</span>
            <span className="like-count">{post.cantidad_Likes || 0}</span>
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

const TrendsSidebar = ({ posts, onFilter, activeFilter }) => {
    const topTrends = useMemo(() => {
        const counts = posts.reduce((acc, post) => {
            const cat = post.categoria || 'General';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
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
                <h3 className="trends-title">Explorar por Categorías</h3>
                {topTrends.map((trend, index) => (
                    <div 
                        key={index} 
                        className={`trend-item ${activeFilter === trend.category ? 'active-filter' : ''}`}
                        onClick={() => onFilter(trend.category)}
                    >
                        <span className="trend-category">Categoría</span>
                        <p className="trend-tag">{trend.category}</p>
                        <span className="trend-count">{trend.count} posts</span>
                    </div>
                ))}
                {activeFilter && (
                    <button className="clear-filter-btn" onClick={() => onFilter(null)}>
                        ❌ Quitar filtro ({activeFilter})
                    </button>
                )}
            </div>
        </aside>
    );
};

const CATEGORIA_COLORS = {
    'Adopción': '#FF6B6B',
    'Educación': '#4ECDC4',
    'Ayuda': '#FFE66D',
    'Historias': '#FF9F43',
    'Salud': '#54A0FF',
    'Evento': '#A3CB38'
};

export const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState(null);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await PostService.getAllPosts();
            setPosts(data.sort((a, b) => b.post_Id - a.post_Id));
        } catch (error) {
            console.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const ejecutarAccionProtegida = (accion) => {
        const user = AuthService.getCurrentUser();
        if (user) accion();
        else setIsLoginModalOpen(true);
    };

    const handleNewPost = async (newPostData) => {
        try {
            await PostService.createPost(newPostData);
            loadPosts(); 
        } catch (e) { alert("Error al publicar"); }
    };

    const addCommentToPost = useCallback(async (post, newComment) => {
        const updated = { ...post, comentarios: [...(post.comentarios || []), newComment] };
        setPosts(prev => prev.map(p => p.post_Id === post.post_Id ? updated : p));
        await PostService.addComment(updated);
    }, []);

    const handleToggleLike = useCallback(async (postId, count) => {
        setPosts(prev => prev.map(p => p.post_Id === postId ? { ...p, cantidad_Likes: count } : p));
        await PostService.updateLikes(postId, count);
    }, []);

    const handleFilter = (category) => {
        setFilterCategory(category === filterCategory ? null : category);
    };

    const filteredPosts = filterCategory 
        ? posts.filter(post => post.categoria === filterCategory)
        : posts;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatEventDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="pagina-container">
            <Header />
            <div className="title-container">
                <h2 className="page-title">BLOG COMUNITARIO 🐾</h2>
                <p className="page-subtitle">Historias y consejos para los amantes de las wawitas.</p>
            </div>
            <div className="forum-layout">
                <main className="forum-feed">
                    {/* WIDGET DE CREACIÓN DE POST (Estilo Facebook/X) */}
                    <CreatePostWidget 
                        onPublish={handleNewPost} 
                        onRestrictedAction={ejecutarAccionProtegida} 
                    />

                    {loading ? <p className="loading-text">Cargando historias... 🐾</p> : 
                        filteredPosts.map(post => (
                            <div key={post.post_Id} className={`blog-card ${post.categoria === 'Evento' ? 'event-card' : ''}`}>
                                <div className="blog-header-image">
                                    <img src={post.foto_Url} alt="blog" onError={(e) => e.target.src = 'https://placedog.net/800/400'} />
                                    {post.categoria === 'Evento' && <div className="event-badge">📅 EVENTO</div>}
                                </div>
                                <div className="post-content-area">
                                    <span 
                                        className="post-status-badge" 
                                        style={{ backgroundColor: CATEGORIA_COLORS[post.categoria] || '#ccc' }}
                                    >
                                        {(post.categoria || 'GENERAL').toUpperCase()}
                                    </span>
                                    
                                    <h3 className="blog-post-title">{post.titulo}</h3>
                                    
                                    <div className="post-meta">
                                        <span className="post-author">✍️ {post.autor_Nombre}</span>
                                        <span className="post-date">🕒 {formatDate(post.fecha_Publicacion)}</span>
                                    </div>

                                    {post.categoria === 'Evento' && (
                                        <div className="event-details-box">
                                            <p><strong>📍 Lugar:</strong> {post.lugar_Evento}</p>
                                            <p><strong>⏰ Cuándo:</strong> {formatEventDate(post.fecha_Evento)}</p>
                                            <p><strong>🏠 Organiza:</strong> {post.refugio_Nombre || post.autor_Nombre}</p>
                                        </div>
                                    )}

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
                    {!loading && filteredPosts.length === 0 && (
                        <div className="no-posts-message">
                            <p>No hay publicaciones en esta categoría aún. ¡Sé el primero!</p>
                            <button onClick={() => setFilterCategory(null)}>Ver todo</button>
                        </div>
                    )}
                </main>
                <TrendsSidebar posts={posts} onFilter={handleFilter} activeFilter={filterCategory} />
            </div>
            
            {/* En tu Blog.jsx simplemente lo llamas así: */}
            <PixelArtDog onRestrictedAction={ejecutarAccionProtegida} />
            
            <LoginModal isVisible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <Footer />
        </div>
    );
};