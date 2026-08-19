import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import attendanceService from '../../services/attendanceService'
import studentService from '../../services/studentService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import AttendanceTable from '../../components/AttendanceTable'

export default function StudentAttendance() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [records, setRecords] = useState([])
  const [percentage, setPercentage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, aRes, pRes] = await Promise.all([
          studentService.getById(studentId),
          attendanceService.getByStudent(studentId),
          attendanceService.getPercentage(studentId)
        ])
        setStudent(sRes.data)
        setRecords(aRes.data || [])
        const rawPct = pRes.data && typeof pRes.data === 'object' ? (pRes.data.percentage ?? 0) : (Number(pRes.data) || 0)
        setPercentage(Number(rawPct) || 0)
      } catch (err) {
        setError('Failed to load attendance data')
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
        <h1>Attendance: {student?.firstName} {student?.lastName}</h1>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ 
          width: '100px', height: '100px', borderRadius: '50%', 
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: `conic-gradient(${numPct >= 75 ? '#10b981' : '#ef4444'} ${Math.min(100, Math.max(0, numPct))}%, #e2e8f0 0)`,
          fontSize: '20px', fontWeight: 'bold'
        }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1e293b' }}>
            {numPct.toFixed(0)}%
          </div>
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>Overall Attendance Rate</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            {numPct >= 75 ? '✅ Student has good attendance.' : '⚠️ Warning: Low attendance! Below the 75% threshold.'}
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
