import api from './api'

const attendanceService = {
  markAttendance: (data) => api.post('/attendance', data),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  getPercentage: (studentId) => api.get(`/attendance/student/${studentId}/percentage`),
  getByDate: (classId, sectionId, date) => api.get(`/attendance`, { params: { classId, sectionId, date } }),
  getLowAttendance: (threshold) => api.get(`/attendance/low`, { params: { threshold } })
}
export default attendanceService
