import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import studentService from '../../services/studentService'
import academicService from '../../services/academicService'
import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'

export default function StudentForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: 'MALE', 
    email: '', phone: '', address: '', classId: '', sectionId: '', academicYearId: ''
  })
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, yRes] = await Promise.all([
          academicService.classes.getAll(),
          academicService.academicYears.getAll()
        ])
        setClasses(cRes.data)
        setYears(yRes.data)
        
        if (id) {
          const sRes = await studentService.getById(id)
          const s = sRes.data
          setFormData({
            firstName: s.firstName || '', lastName: s.lastName || '', 
            dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split('T')[0] : '', 
            gender: s.gender || 'MALE', email: s.email || '', 
            phone: s.phone || '', address: s.address || '', 
            classId: s.classId || '', sectionId: s.sectionId || '', 
            academicYearId: s.academicYearId || ''
          })
          if (s.classId) {
            const secRes = await academicService.sections.getByClass(s.classId)
            setSections(secRes.data)
          }
        }
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleClassChange = async (e) => {
    const classId = e.target.value
    setFormData({ ...formData, classId, sectionId: '' })
    if (classId) {
      try {
        const res = await academicService.sections.getByClass(classId)
        setSections(res.data)
      } catch (err) {
        setSections([])
      }
    } else {
      setSections([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await studentService.update(id, formData)
      navigate(`/students/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>Edit Student</h1>
        <button className="btn" onClick={() => navigate(`/students/${id}`)}>Cancel</button>
      </div>
      
      <div className="card" style={{ maxWidth: '800px' }}>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Academic Year</label>
              <select value={formData.academicYearId} onChange={e => setFormData({...formData, academicYearId: e.target.value})}>
                <option value="">Select Year</option>
                {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Class</label>
              <select value={formData.classId} onChange={handleClassChange}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Section</label>
              <select value={formData.sectionId} onChange={e => setFormData({...formData, sectionId: e.target.value})}>
                <option value="">Select Section</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}
