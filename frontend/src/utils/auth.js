export const saveToken = (token) => localStorage.setItem("authToken", token);

export const getToken = () => localStorage.getItem("authToken");

export const logout = () => localStorage.removeItem("authToken");
