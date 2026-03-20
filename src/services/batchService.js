import api from "./api";

export const getAllBatches = () => api.get("/batches");
export const getBatchesByAnalyst = (analystId) => api.get(`/batches/analyst/${analystId}`);
export const getBatchesByTrainer = (trainerId) => api.get(`/batches/trainer/${trainerId}`);

/**
 * Create a batch.
 * @param {Object} batchData - Fields: batchName, course, startDate, endDate, capacity, status
 * @param {number} analystId - ID of the analyst creating the batch
 * @param {number} trainerId - ID of the assigned trainer
 */
export const createBatch = (batchData, analystId, trainerId) =>
  api.post(`/batches?analystId=${analystId}&trainerId=${trainerId}`, batchData);

export const updateBatch = (id, batchData) => api.put(`/batches/${id}`, batchData);
export const deleteBatch = (id) => api.delete(`/batches/${id}`);
