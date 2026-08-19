import api from './api'

const admissionService = {
  getAll: () => api.get('/admissions'),
  getById: (id) => api.get(`/admissions/${id}`),
  create: (data) => api.post('/admissions', data),
  updateStatus: (id, status) => api.put(`/admissions/${id}/status`, null, { params: { status } }),
  getByStatus: (status) => api.get(`/admissions/status/${status}`)
}
export default admissionService
