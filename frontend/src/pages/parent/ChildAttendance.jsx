import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import parentService from '../../services/parentService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import AttendanceTable from '../../components/AttendanceTable'

export default function ChildAttendance() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [percentage, setPercentage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, pRes] = await Promise.all([
          parentService.getChildAttendance(studentId),
          parentService.getChildAttendancePercentage(studentId)
        ])
        setRecords(aRes.data || [])
        const rawPct = pRes.data && typeof pRes.data === 'object' ? (pRes.data.percentage ?? 0) : (Number(pRes.data) || 0)
        setPercentage(Number(rawPct) || 0)
      } catch (err) {
        setError('Failed to load attendance')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [studentId])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  const numPct = typeof percentage === 'number' ? percentage : (Number(percentage) || 0)

  return (
    <div>
      <div className="page-header">
        <h1>Attendance Record</h1>
        <button className="btn btn-secondary" onClick={() => navigate(`/parent/child/${studentId}`)}>← Back to Profile</button>
      </div>

      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ 
          width: '90px', height: '90px', borderRadius: '50%', 
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: `conic-gradient(${numPct >= 75 ? '#10b981' : '#ef4444'} ${Math.min(100, Math.max(0, numPct))}%, #e2e8f0 0)`,
          fontSize: '18px', fontWeight: 'bold', flexShrink: 0
        }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-primary)' }}>
            {numPct.toFixed(0)}%
          </div>
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <h3 style={{ margin: '0 0 4px 0' }}>Overall Attendance Rate</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            {numPct >= 75 ? '✅ Attendance is satisfactory and above minimum requirements.' : '⚠️ Warning: Attendance is below the required 75% threshold.'}
          </p>
          {numPct < 75 && (
            <div className="alert-danger" style={{ margin: '8px 0 0', display: 'inline-block' }}>
              Low attendance warning! Student is below the 75% threshold.
            </div>
          )}
        </div>
      </div>

      <AttendanceTable records={records} />
    </div>
  )
}
