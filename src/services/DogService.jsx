import apiClient from "./instance/apiClient.js";

const DogService = {
    getLostDogs: async () => {
        try {
            const response = await apiClient.get('/lostDogs');
            return response.data;
        } catch (error) {
            throw new Error('No se pudo cargar la lista.');
        }
    },

    reportLostDog: async (dogData) => {
        try {
            const response = await apiClient.post('/lostDogs', dogData);
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
    }
};

export default DogService;