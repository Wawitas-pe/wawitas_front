export const saveSession = (user) => {
    localStorage.setItem("user", JSON.stringify({
        id: user.id,
        nombre: user.nombreCompleto,
        rol: user.rol || "usuario"
    }));
};

export const getSession = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const clearSession = () => {
    localStorage.removeItem("user");
    window.location.reload();
};