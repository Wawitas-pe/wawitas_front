import axios from 'axios';

const apiClient = axios.create({
    //baseURL: 'https://localhost:7154',
    baseURL: 'http://localhost:3001',
    timeout: 10000, // Tiempo de espera
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mantén el resto como lo tenías (puedes dejar el interceptor comentado por ahora)
export default apiClient;