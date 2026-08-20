import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import admissionService from '../../services/admissionService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { formatDate } from '../../utils/formatDate'

export default function AdmissionDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [admission, setAdmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchAdmission = async () => {
    try {
      const res = await admissionService.getById(id)
      setAdmission(res.data)
    } catch (err) {
      setError('Failed to load admission application')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAdmission() }, [id])

  const handleStatusChange = async (newStatus) => {
    if (['CONFIRMED', 'REJECTED'].includes(newStatus)) {
      if (!window.confirm(`Are you sure you want to mark this application as ${newStatus}?`)) return
    }
    
    setError('')
    setSuccess('')
    try {
      await admissionService.updateStatus(id, newStatus)
      setSuccess(`Application status successfully updated to ${newStatus}!`)
      fetchAdmission()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admission status')
    }
  }

  if (loading) return <Loading />
  if (error && !admission) return <ErrorMessage message={error} />
  if (!admission) return <div>Admission application not found</div>

  const isFinalStatus = ['CONFIRMED', 'REJECTED'].includes(admission.status)

  return (
    <div>
      <div className="page-header">
        <h1>Admission Application Details</h1>
        <button className="btn" onClick={() => navigate('/admissions')}>← Back to List</button>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <div className="status-badge active" style={{ padding: '12px', marginBottom: '16px', display: 'block' }}>{success}</div>}

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>{admission.studentName}</h2>
          <span className={`status-badge ${admission.status}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
            {admission.status}
          </span>
        </div>
        
        <div className="form-row">
          <div>
            <p><strong>Application Number:</strong> {admission.applicationNumber}</p>
            <p><strong>Date of Birth:</strong> {formatDate(admission.dateOfBirth)}</p>
            <p><strong>Gender:</strong> {admission.gender}</p>
            <p><strong>Previous School:</strong> {admission.previousSchool || '-'}</p>
          </div>
          <div>
            <p><strong>Parent / Guardian Name:</strong> {admission.parentName}</p>
            <p><strong>Parent Email:</strong> {admission.parentEmail}</p>
            <p><strong>Parent Phone:</strong> {admission.parentPhone}</p>
            <p><strong>Applied On:</strong> {formatDate(admission.applicationDate)}</p>
          </div>
        </div>
      </div>

      {!isFinalStatus && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Application Workflow Actions</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {admission.status === 'NEW' && (
              <button className="btn btn-secondary" onClick={() => handleStatusChange('CONTACTED')}>
                Mark Contacted
              </button>
            )}
            {['NEW', 'CONTACTED'].includes(admission.status) && (
              <button className="btn btn-primary" onClick={() => handleStatusChange('INTERVIEW_SCHEDULED')}>
                Schedule Interview
              </button>
            )}
            {admission.status !== 'CONFIRMED' && (
              <button className="btn btn-primary" style={{ backgroundColor: 'var(--success)' }} onClick={() => handleStatusChange('CONFIRMED')}>
                ✓ Confirm Admission & Generate Student ID
              </button>
            )}
            {admission.status !== 'REJECTED' && (
              <button className="btn btn-danger" onClick={() => handleStatusChange('REJECTED')}>
                ✕ Reject Application
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
