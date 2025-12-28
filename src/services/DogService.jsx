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
    }
};

export default DogService;