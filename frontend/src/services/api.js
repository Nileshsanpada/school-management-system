import axios from 'axios'

const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
)

const baseURL = isLocalhost
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || 'https://school-management-system-ysml.onrender.com/api')

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor - add JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
