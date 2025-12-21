import apiClient from "./instance/apiClient.js";

const AuthService = {
    login: async (credentials) => {
        try {
            const response = await apiClient.get(`/users?email=${credentials.email}`);
            const users = response.data;

            if (users.length === 0) {
                throw new Error('El correo electrónico no está registrado.');
            }

            const user = users[0];

            if (user.password !== credentials.password) {
                throw new Error('La contraseña es incorrecta.');
            }

            localStorage.setItem("user", JSON.stringify({
                id: user.id,
                nombre: user.nombreCompleto,
                rol: user.rol || "usuario"
            }));

            return user;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const newUser = {
                ...userData,
                rol: "usuario"
            };
            const response = await apiClient.post('/users', newUser);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("user");
        window.location.reload();
    },

    getCurrentUser: () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
};

export default AuthService;