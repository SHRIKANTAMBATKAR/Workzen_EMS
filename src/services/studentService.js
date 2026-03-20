import api from "./api";

export const getAllStudents = () => api.get("/students");
export const getStudentsByCounselor = (counselorId) => api.get(`/students/counselor/${counselorId}`);
export const getStudentsByBatch     = (batchId) => api.get(`/students/batch/${batchId}`);

/**
 * Add a new student.
 * @param {Object} studentData - name, email, phone, course, status, enrolmentDate, performance
 * @param {number} counselorId - ID of the counselor registering the student
 * @param {number|null} batchId - optional batch to assign
 */
export const addStudent = (studentData, counselorId, batchId = null) => {
  const params = batchId
    ? `?counselorId=${counselorId}&batchId=${batchId}`
    : `?counselorId=${counselorId}`;
  return api.post(`/students${params}`, studentData);
};

/**
 * Update an existing student.
 * @param {number} id - student ID
 * @param {Object} studentData - updated fields
 * @param {number|null} batchId - optional batch reassignment
 */
export const updateStudent = (id, studentData, batchId = null) => {
  const params = batchId ? `?batchId=${batchId}` : "";
  return api.put(`/students/${id}${params}`, studentData);
};

export const deleteStudent = (id) => api.delete(`/students/${id}`);
