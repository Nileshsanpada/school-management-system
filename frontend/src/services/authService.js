import api from './api'

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  sendOtp: (email) => api.post('/auth/send-otp', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp })
}
export default authService
