import api from './api'

const resultService = {
  getAll: () => api.get('/results'),
  create: (data) => api.post('/results', data),
  getByStudent: (studentId) => api.get(`/results/student/${studentId}`),
  getByExamination: (examId) => api.get(`/results/examination/${examId}`),
  getByStudentAndExam: (studentId, examId) => api.get(`/results/student/${studentId}/examination/${examId}`)
}
export default resultService
