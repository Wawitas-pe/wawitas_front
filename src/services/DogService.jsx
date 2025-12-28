import apiClient from "./instance/apiClient.js";

let URL_PREFIX = '/api/dogs';
const DogService = {

    getLostDogs: async () => {
        try {
            const response = await apiClient.get(URL_PREFIX+'/lost');
            return response.data;
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            throw new Error('No se pudo cargar la lista.');
        }
    },

    getLostDetails: async (id) => {
        try {
            const response = await apiClient.get(URL_PREFIX+`/details/${id}`,id);
            return response.data;
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            throw new Error('No se pudo cargar la lista.');
        }
    },

    getLostCoords: async () => {
        try {
            const response = await apiClient.get('/api/sighting/coords');
            return response.data;
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            throw new Error('No se pudo cargar la lista.');
        }
    },


    newLostDog: async (dogData) => {
        try {
            const response = await apiClient.post(URL_PREFIX+'/new-lost', dogData);
            return response.data;
        } catch (error) {
            throw new Error('No se pudo guardar el reporte.');
        }
    },

    updateDogLocation: async (id, updatedData) => {
        try {
            const response = await apiClient.put(`/lostDogs/${id}`, updatedData);
            return response.data;
        } catch (error) {
            throw new Error('No se pudo actualizar la ubicación.');
        }
    },

    // Nuevo método para reporte de abuso/avistamiento
    reportAbuse: async (reportData) => {
        try {
            // Ajusta la URL según tu controlador backend
            const response = await apiClient.post(URL_PREFIX + '/report-abuse', reportData);
            return response.data;
        } catch (error) {
            throw new Error('No se pudo enviar el reporte de abuso.');
        }
    },

    // Nuevo método para registrar avistamiento (TuZona)
    registerSighting: async (sightingData) => {
        try {
            const response = await apiClient.post('/api/sighting/new', sightingData);
            return response.data;
        } catch (error) {
            throw new Error('No se pudo registrar el avistamiento.');
        }
    }
};

export default DogService;