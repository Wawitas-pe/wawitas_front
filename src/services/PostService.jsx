// src/services/PostService.jsx
import apiClient from './instance/apiClient.js';

let URL_PREFIX = '/api/post';
const PostService = {
    // GET: Obtener todas las publicaciones
    getAllPosts: async () => {
        try {
            const response = await apiClient.get(URL_PREFIX+'/posts');
            return response.data; // Array de posts
        } catch (error) {
            console.error('Error al obtener publicaciones:', error);
            throw error;
        }
    },

    createPost: async (postData) => {
        try {
            const response = await apiClient.post('/posts', postData);
            return response.data; // Devuelve el post creado con ID
        } catch (error) {
            console.error('Error al crear publicación:', error);
            throw error;
        }
    },

    // PATCH: Actualizar solo el campo 'likes'
    updateLikes: async (postId, newLikesCount) => {
        try {
            const response = await apiClient.patch(`/posts/${postId}`, { likes: newLikesCount });
            return response.data; // Devuelve el post actualizado
        } catch (error) {
            console.error('Error al actualizar likes:', error);
            throw error;
        }
    },

    // PATCH: Añadir un comentario (actualiza el array de comentarios del post)
    addComment: async (post) => {
        try {
            // JSON Server requiere enviar el array de comentarios completo para actualizarlo
            const response = await apiClient.patch(`/posts/${post.id}`, { comentarios: post.comentarios });
            return response.data;
        } catch (error) {
            console.error('Error al añadir comentario:', error);
            throw error;
        }
    },
};

export default PostService;