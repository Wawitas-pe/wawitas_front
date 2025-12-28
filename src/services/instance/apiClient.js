import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://localhost:7154',
    //baseURL: 'http://localhost:3001',
    timeout: 10000, // Tiempo de espera
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTOR DE PETICIÓN (REQUEST): Inyecta el token antes de enviar
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// INTERCEPTOR DE RESPUESTA (RESPONSE): Maneja el login y errores globales
apiClient.interceptors.response.use(
    (response) => {
        if (response.config.url.includes('/login')) {
            const { id, name, rol, token } = response.data;

            if (token) {
                localStorage.setItem("token", token);
            }

            localStorage.setItem("user", JSON.stringify({
                id: id,
                nombre: name,
                rol: rol
            }));
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;