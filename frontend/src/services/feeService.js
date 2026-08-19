import api from './api'

const feeService = {
  create: (data) => api.post('/fees', data),
  getByStudent: (studentId) => api.get(`/fees/student/${studentId}`),
  getById: (id) => api.get(`/fees/${id}`),
  getOverdue: () => api.get('/fees/overdue')
}
export default feeService
