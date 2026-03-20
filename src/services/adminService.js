import api from "./api";

// ─── Analysts ────────────────────────────────────────────────────────────────
export const getAllAnalysts = () => api.get("/admins/analysts");
export const addAnalyst    = (data) => api.post("/admins/analysts", data);
export const updateAnalyst = (id, data) => api.put(`/admins/analysts/${id}`, data);
export const deleteAnalyst = (id) => api.delete(`/admins/analysts/${id}`);

// ─── Counselors ──────────────────────────────────────────────────────────────
export const getAllCounselors = () => api.get("/admins/counselors");
export const addCounselor    = (data) => api.post("/admins/counselors", data);
export const updateCounselor = (id, data) => api.put(`/admins/counselors/${id}`, data);
export const deleteCounselor = (id) => api.delete(`/admins/counselors/${id}`);

// ─── Trainers ─────────────────────────────────────────────────────────────────
export const getAllTrainers = () => api.get("/admins/trainers");
export const addTrainer    = (data) => api.post("/admins/trainers", data);
export const updateTrainer = (id, data) => api.put(`/admins/trainers/${id}`, data);
export const deleteTrainer = (id) => api.delete(`/admins/trainers/${id}`);
