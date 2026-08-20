import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import studentService from '../../services/studentService'
import attendanceService from '../../services/attendanceService'
import resultService from '../../services/resultService'
import feeService from '../../services/feeService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import AttendanceTable from '../../components/AttendanceTable'
import ResultTable from '../../components/ResultTable'
import FeeTable from '../../components/FeeTable'
import { formatDate } from '../../utils/formatDate'

export default function StudentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('PROFILE')
  
  const [student, setStudent] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [results, setResults] = useState([])
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await studentService.getById(id)
        setStudent(res.data)
      } catch (err) {
        setError('Failed to load student')
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [id])

  useEffect(() => {
    if (!student) return
    const fetchTabData = async () => {
      try {
        if (activeTab === 'ATTENDANCE' && attendance.length === 0) {
          const res = await attendanceService.getByStudent(student.id)
          setAttendance(res.data)
        } else if (activeTab === 'RESULTS' && results.length === 0) {
          const res = await resultService.getByStudent(student.id)
          setResults(res.data)
        } else if (activeTab === 'FEES' && fees.length === 0) {
          const res = await feeService.getByStudent(student.id)
          setFees(res.data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchTabData()
  }, [activeTab, student, attendance.length, results.length, fees.length])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!student) return <div>Not found</div>

  return (
    <div>
      <div className="page-header">
        <h1>{student.firstName} {student.lastName}</h1>
        <div>
          <button className="btn" style={{ marginRight: '12px' }} onClick={() => navigate(`/students/${id}/edit`)}>Edit</button>
          <button className="btn" onClick={() => navigate('/students')}>Back</button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '20px', 
        overflowX: 'auto', 
        paddingBottom: '8px', 
        WebkitOverflowScrolling: 'touch',
        borderBottom: '1px solid var(--border-color)' 
      }}>
        {['PROFILE', 'ATTENDANCE', 'RESULTS', 'FEES'].map(tab => (
          <button 
            key={tab} 
            className="btn btn-sm"
            style={{ 
              background: activeTab === tab ? 'var(--primary)' : 'var(--bg-surface-elevated)',
              color: activeTab === tab ? '#ffffff' : 'var(--text-primary)',
              border: '1px solid ' + (activeTab === tab ? 'var(--primary)' : 'var(--border-color)'),
              whiteSpace: 'nowrap',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)'
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'PROFILE' && (
        <div className="card">
          <div className="form-row">
            <div>
              <p><strong>Student ID:</strong> {student.studentId}</p>
              <p><strong>Class:</strong> {student.className || '-'}</p>
              <p><strong>Section:</strong> {student.sectionName || '-'}</p>
              <p><strong>Roll Number:</strong> {student.rollNumber || '-'}</p>
            </div>
            <div>
              <p><strong>DOB:</strong> {formatDate(student.dateOfBirth)}</p>
              <p><strong>Gender:</strong> {student.gender}</p>
              <p><strong>Email:</strong> {student.email || '-'}</p>
              <p><strong>Phone:</strong> {student.phone || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ATTENDANCE' && <AttendanceTable records={attendance} />}
      {activeTab === 'RESULTS' && <ResultTable results={results} />}
      {activeTab === 'FEES' && <FeeTable fees={fees} />}
    </div>
  )
}
