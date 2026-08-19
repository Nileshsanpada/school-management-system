import api from './api'

const parentService = {
  getProfile: () => api.get('/parent/profile'),
  getChildAttendance: (studentId) => api.get(`/parent/child/${studentId}/attendance`),
  getChildAttendancePercentage: (studentId) => api.get(`/parent/child/${studentId}/attendance/percentage`),
  getChildResults: (studentId) => api.get(`/parent/child/${studentId}/results`),
  getChildFees: (studentId) => api.get(`/parent/child/${studentId}/fees`)
}
export default parentService
