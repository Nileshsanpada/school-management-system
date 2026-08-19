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

  const fetchAdmission = async () => {
    try {
      const res = await admissionService.getById(id)
      setAdmission(res.data)
    } catch (err) {
      setError('Failed to load admission')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAdmission() }, [id])

  const handleStatusChange = async (newStatus) => {
    if (['CONFIRMED', 'REJECTED'].includes(newStatus)) {
      if (!window.confirm(`Are you sure you want to mark this application as ${newStatus}?`)) return
    }
    
    try {
      await admissionService.updateStatus(id, newStatus)
      fetchAdmission()
    } catch (err) {
      setError('Failed to update status')
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!admission) return <div>Not found</div>

  const isFinalStatus = ['CONFIRMED', 'REJECTED'].includes(admission.status)

  return (
    <div>
      <div className="page-header">
        <h1>Admission Application</h1>
        <button className="btn" onClick={() => navigate('/admissions')}>Back</button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>{admission.studentName}</h2>
          <span className={`status-badge ${admission.status}`} style={{ fontSize: '14px', padding: '6px 12px' }}>
            {admission.status}
          </span>
        </div>
        
        <div className="form-row">
          <div>
            <p><strong>App Number:</strong> {admission.applicationNumber}</p>
            <p><strong>DOB:</strong> {formatDate(admission.dateOfBirth)}</p>
            <p><strong>Gender:</strong> {admission.gender}</p>
            <p><strong>Previous School:</strong> {admission.previousSchool || '-'}</p>
          </div>
          <div>
            <p><strong>Parent Name:</strong> {admission.parentName}</p>
            <p><strong>Email:</strong> {admission.parentEmail}</p>
            <p><strong>Phone:</strong> {admission.parentPhone}</p>
            <p><strong>Applied On:</strong> {formatDate(admission.applicationDate)}</p>
          </div>
        </div>
      </div>

      {!isFinalStatus && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Update Status</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {admission.status === 'PENDING' && (
              <button className="btn btn-primary" onClick={() => handleStatusChange('UNDER_REVIEW')}>Mark Under Review</button>
            )}
            {admission.status !== 'CONFIRMED' && (
              <button className="btn btn-success" onClick={() => handleStatusChange('CONFIRMED')}>Confirm Admission</button>
            )}
            {admission.status !== 'REJECTED' && (
              <button className="btn btn-danger" onClick={() => handleStatusChange('REJECTED')}>Reject Application</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
