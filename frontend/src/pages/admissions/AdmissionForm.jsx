import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import admissionService from '../../services/admissionService'
import { useAuth } from '../../hooks/useAuth'
import ErrorMessage from '../../components/ErrorMessage'

export default function AdmissionForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    gender: 'MALE',
    parentName: user?.role === 'PARENT' ? (user.name || '') : '',
    parentEmail: user?.role === 'PARENT' ? (user.email || '') : '',
    parentPhone: '',
    previousSchool: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submittedData, setSubmittedData] = useState(null)

  useEffect(() => {
    if (user?.role === 'PARENT') {
      setFormData(prev => ({
        ...prev,
        parentName: prev.parentName || user.name || '',
        parentEmail: prev.parentEmail || user.email || ''
      }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await admissionService.create(formData)
      setSubmittedData(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit admission application. Please check details and try again.')
    } finally {
      setLoading(false)
    }
  }

  // If application is submitted successfully, show a clear confirmation screen
  if (submittedData) {
    return (
      <div style={{ maxWidth: '700px', margin: '30px auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{
            fontSize: '48px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--success)'
          }}>
            ✓
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
            Application Submitted Successfully!
          </h2>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
            Your admission application for <strong>{submittedData.studentName}</strong> has been received by EduCore Administration.
          </p>

          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '28px',
            fontSize: '14px'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Application Number:</span>{' '}
              <strong style={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '15px' }}>
                {submittedData.applicationNumber}
              </strong>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Student Name:</span>{' '}
              <strong>{submittedData.studentName}</strong>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Parent Email:</span>{' '}
              <strong>{submittedData.parentEmail}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>{' '}
              <span className="status-badge new" style={{ marginLeft: '6px' }}>{submittedData.status || 'NEW'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {user?.role === 'PARENT' ? (
              <button 
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '15px' }}
                onClick={() => navigate('/parent/dashboard')}
              >
                ← Return to Parent Dashboard
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '15px' }}
                onClick={() => navigate('/admissions')}
              >
                View All Admissions List →
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>New Admission Application</h1>
        <button className="btn" onClick={() => navigate(user?.role === 'PARENT' ? '/parent/dashboard' : '/admissions')}>
          ← Back
        </button>
      </div>
      
      <div className="card" style={{ maxWidth: '800px' }}>
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '16px' }}>Student Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Student Full Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Aarav Sharma"
                value={formData.studentName} 
                onChange={e => setFormData({...formData, studentName: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input 
                type="date" 
                value={formData.dateOfBirth} 
                onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} 
                required 
              />
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
              <label>Previous School (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. St. Xavier's High School"
                value={formData.previousSchool} 
                onChange={e => setFormData({...formData, previousSchool: e.target.value})} 
              />
            </div>
          </div>
          
          <h3 style={{ margin: '24px 0 16px' }}>Parent / Guardian Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Parent / Guardian Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Suresh Sharma"
                value={formData.parentName} 
                onChange={e => setFormData({...formData, parentName: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Parent Mobile Phone *</label>
              <input 
                type="tel" 
                placeholder="e.g. 9876543210"
                value={formData.parentPhone} 
                onChange={e => setFormData({...formData, parentPhone: e.target.value})} 
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Parent Email Address *</label>
            <input 
              type="email" 
              placeholder="e.g. parent@school.com"
              value={formData.parentEmail} 
              onChange={e => setFormData({...formData, parentEmail: e.target.value})} 
              required 
            />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              💡 Once confirmed by the school admin, this child will be automatically linked to this email account.
            </div>
          </div>
          
          <div style={{ marginTop: '28px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ padding: '12px 28px', fontSize: '15px' }}
            >
              {loading ? '⏳ Submitting Application...' : '✓ Submit Admission Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
