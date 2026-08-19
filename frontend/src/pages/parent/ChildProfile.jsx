import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import parentService from '../../services/parentService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { formatDate } from '../../utils/formatDate'

export default function ChildProfile() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const res = await parentService.getProfile()
        const found = res.data.children?.find(c => c.id?.toString() === studentId || c.studentId === studentId)
        if (found) setChild(found)
        else setError('Child not found')
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchChild()
  }, [studentId])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!child) return null

  return (
    <div>
      <div className="page-header">
        <h1>{child.firstName} {child.lastName}</h1>
        <button className="btn" onClick={() => navigate('/parent/dashboard')}>Back to Dashboard</button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate(`/parent/child/${studentId}/attendance`)}>
          <h3 style={{ color: 'var(--primary)' }}>Attendance</h3>
          <p>View daily attendance and overall percentage</p>
        </div>
        <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate(`/parent/child/${studentId}/results`)}>
          <h3 style={{ color: 'var(--primary)' }}>Results</h3>
          <p>View exam results and academic performance</p>
        </div>
        <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate(`/parent/child/${studentId}/fees`)}>
          <h3 style={{ color: 'var(--primary)' }}>Fees</h3>
          <p>View fee structure and outstanding payments</p>
        </div>
      </div>

      <div className="card">
        <h3>Student Profile</h3>
        <div className="form-row" style={{ marginTop: '16px' }}>
          <div>
            <p><strong>Student ID:</strong> {child.studentId}</p>
            <p><strong>Class:</strong> {child.className || '-'}</p>
            <p><strong>Section:</strong> {child.sectionName || '-'}</p>
            <p><strong>Roll Number:</strong> {child.rollNumber || '-'}</p>
          </div>
          <div>
            <p><strong>Date of Birth:</strong> {formatDate(child.dateOfBirth)}</p>
            <p><strong>Gender:</strong> {child.gender}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
