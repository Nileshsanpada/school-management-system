import api from './api'

const academicService = {
  academicYears: {
    getAll: () => api.get('/academic-years'),
    getById: (id) => api.get(`/academic-years/${id}`),
    create: (data) => api.post('/academic-years', data),
    update: (id, data) => api.put(`/academic-years/${id}`, data),
    delete: (id) => api.delete(`/academic-years/${id}`),
    getActive: () => api.get('/academic-years/active')
  },
  classes: {
    getAll: () => api.get('/classes'),
    getById: (id) => api.get(`/classes/${id}`),
    create: (data) => api.post('/classes', data),
    update: (id, data) => api.put(`/classes/${id}`, data),
    delete: (id) => api.delete(`/classes/${id}`)
  },
  sections: {
    getAll: () => api.get('/sections'),
    getById: (id) => api.get(`/sections/${id}`),
    getByClass: (classId) => api.get(`/sections/class/${classId}`),
    create: (data) => api.post('/sections', data),
    delete: (id) => api.delete(`/sections/${id}`)
  },
  subjects: {
    getAll: () => api.get('/subjects'),
    getById: (id) => api.get(`/subjects/${id}`),
    create: (data) => api.post('/subjects', data),
    update: (id, data) => api.put(`/subjects/${id}`, data),
    delete: (id) => api.delete(`/subjects/${id}`)
  },
  teachers: {
    getAll: () => api.get('/teachers'),
    getById: (id) => api.get(`/teachers/${id}`),
    create: (data) => api.post('/teachers', data),
    update: (id, data) => api.put(`/teachers/${id}`, data),
    delete: (id) => api.delete(`/teachers/${id}`)
  },
  examinations: {
    getAll: () => api.get('/examinations'),
    getById: (id) => api.get(`/examinations/${id}`),
    create: (data) => api.post('/examinations', data),
    getByAcademicYear: (yearId) => api.get(`/examinations/year/${yearId}`),
    getByClass: (classId) => api.get(`/examinations/class/${classId}`)
  }
}
export default academicService
