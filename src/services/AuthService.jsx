import apiClient from "./instance/apiClient.js";


let URL_PREFIX = '/api/auth';
const UserService = {

    // ----------------------------------------------------
    // 1. Obtener una lista de usuarios (GET)
    // ----------------------------------------------------
    getAllUsers: async () => {
        try {
            const response = await apiClient.get('/users');
            // Axios envuelve la respuesta en un objeto 'data'
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            // Podemos lanzar el error para que el componente lo maneje
            throw error;
        }
    },


    login: async (loginRequest) => {
        try {
            const response = await apiClient.post(URL_PREFIX+'/login', loginRequest);
            return response.data;
        } catch (error) {
            console.error('Error login user:', error.response ? error.response.data : error.message);
            throw error;
        }
    },


    getUserById: async (id) => {
        try {
            const response = await apiClient.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            throw error;
        }
    },

    // ----------------------------------------------------
    // 3. Crear un nuevo usuario (POST)
    // ----------------------------------------------------
    createUser: async (userData) => {
        try {
            // POST necesita el endpoint y los datos a enviar
            const response = await apiClient.post('/users', userData);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
};

export default UserService;