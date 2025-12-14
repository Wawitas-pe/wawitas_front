import apiClient from "./instance/apiClient.js";


const DogService = {
    /**
     * Obtiene la lista de perros reportados como perdidos.
     * @returns {Promise<Array>} - Array de objetos perro.
     */
    getLostDogs: async () => {
        try {
            // Llama al endpoint /lostDogs de tu backend/JSON Server
            const response = await apiClient.get('/lostDogs');
            return response.data;
        } catch (error) {
            console.error('Error al obtener perros perdidos:', error.response ? error.response.data : error.message);
            throw new Error('No se pudo cargar la lista de perros perdidos.');
        }
    },

    // Aquí podrías añadir funciones como reportLostDog(dogData) si fuera necesario
};

export default DogService;