import api from "./api";

export const getAllUsers = () => api.get("/users");
export const getUsersByRole = (role) => api.get(`/users?role=${role}`);
export const getUserById = (id) => api.get(`/users/${id}`);
