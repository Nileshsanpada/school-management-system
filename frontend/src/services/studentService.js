import api from './api'

const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getByStudentId: (studentId) => api.get(`/students/studentId/${studentId}`),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getByClass: (classId) => api.get(`/students/class/${classId}`),
  getByClassAndSection: (classId, sectionId) => api.get(`/students/class/${classId}/section/${sectionId}`),
  search: (query) => api.get(`/students/search`, { params: { query } }),
  getAcademicHistory: (id) => api.get(`/students/${id}/history`)
}
export default studentService
