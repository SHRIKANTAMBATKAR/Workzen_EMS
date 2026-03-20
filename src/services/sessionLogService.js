import api from "./api";

export const getAllSessionLogs = () => api.get("/sessionLogs");
export const getLogsByBatch   = (batchId) => api.get(`/sessionLogs/batch/${batchId}`);
export const getLogsByTrainer = (trainerId) => api.get(`/sessionLogs/trainer/${trainerId}`);

/**
 * Add a session log entry.
 * @param {Object} logData - topicCovered, notes, date, completionPercentage
 * @param {number} batchId - batch this log belongs to
 * @param {number} trainerId - trainer submitting the log
 */
export const addSessionLog = (logData, batchId, trainerId) =>
  api.post(`/sessionLogs?batchId=${batchId}&trainerId=${trainerId}`, logData);

export const updateSessionLog = (id, logData) => api.put(`/sessionLogs/${id}`, logData);
export const deleteSessionLog = (id) => api.delete(`/sessionLogs/${id}`);
