import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import admissionService from '../../services/admissionService'
import ErrorMessage from '../../components/ErrorMessage'

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    studentName: '', dateOfBirth: '', gender: 'MALE', 
    parentName: '', parentEmail: '', parentPhone: '', previousSchool: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await admissionService.create(formData)
      navigate('/admissions')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit admission')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>New Admission Application</h1>
        <button className="btn" onClick={() => navigate('/admissions')}>Back</button>
      </div>
      
      <div className="card" style={{ maxWidth: '800px' }}>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '16px' }}>Student Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Student Name *</label>
              <input type="text" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Previous School</label>
              <input type="text" value={formData.previousSchool} onChange={e => setFormData({...formData, previousSchool: e.target.value})} />
            </div>
          </div>
          
          <h3 style={{ margin: '24px 0 16px' }}>Parent/Guardian Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Parent Name *</label>
              <input type="text" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Parent Phone *</label>
              <input type="text" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label>Parent Email *</label>
            <input type="email" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} required />
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  )
}
