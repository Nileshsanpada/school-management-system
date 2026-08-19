import api from './api'

const resultService = {
  create: (data) => api.post('/results', data),
  getByStudent: (studentId) => api.get(`/results/student/${studentId}`),
  getByExamination: (examId) => api.get(`/results/examination/${examId}`),
  getByStudentAndExam: (studentId, examId) => api.get(`/results`, { params: { studentId, examId } })
}
export default resultService
