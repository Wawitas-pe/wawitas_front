import apiClient from "./instance/apiClient.js";

let URL_PREFIX = '/api/auth';
const AuthService = {

    login: async (credentials) => {

        // eslint-disable-next-line no-useless-catch
        try {
            const response = await apiClient.post(URL_PREFIX+'/login', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {

        // eslint-disable-next-line no-useless-catch
        try {
            const newUser = {
                ...userData
            };
            const response = await apiClient.post(URL_PREFIX+'/register', newUser);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.reload();
    },

    getCurrentUser: () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
};

export default AuthService;