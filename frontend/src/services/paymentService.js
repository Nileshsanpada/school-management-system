import api from './api'

const paymentService = {
  getAll: () => api.get('/payments'),
  create: (data) => api.post('/payments', data),
  getByStudent: (studentId) => api.get(`/payments/student/${studentId}`),
  getByFee: (feeId) => api.get(`/payments/fee/${feeId}`)
}
export default paymentService
