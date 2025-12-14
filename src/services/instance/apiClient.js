import axios from 'axios';

// 1. Crear una instancia de Axios
const apiClient = axios.create({
    baseURL: 'https://localhost:7154',
    //baseURL: 'http://localhost:3001',
    timeout: 10000, // Tiempo de espera
    headers: {
        'Content-Type': 'application/json',
    },
});

//apiClient.interceptors.request.use(
//     (config) => {
//         // Obtener el token (de localStorage, cookies, o tu hook de auth)
//         const token = localStorage.getItem('userToken');
//         if (token) {
//             // Adjuntar el token a todas las solicitudes
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export default apiClient;