import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import academicService from '../../services/academicService'
import studentService from '../../services/studentService'
import attendanceService from '../../services/attendanceService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [classId, setClassId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    academicService.classes.getAll()
      .then(res => setClasses(res.data))
      .catch(() => setError('Failed to load classes'))
      .finally(() => setLoading(false))
  }, [])

  const handleClassChange = async (e) => {
    const cid = e.target.value
    setClassId(cid)
    setSectionId('')
    setStudents([])
    if (cid) {
      try {
        const res = await academicService.sections.getByClass(cid)
        setSections(res.data)
      } catch (err) {
        setSections([])
      }
    } else {
      setSections([])
    }
  }

  const loadStudents = async () => {
    if (!classId || !sectionId || !date) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const sRes = await studentService.getByClassAndSection(classId, sectionId)
      const studentsList = sRes.data
      setStudents(studentsList)
      
      const initialData = {}
      studentsList.forEach(s => {
        initialData[s.id] = { status: 'PRESENT', remarks: '' }
      })
      
      try {
        const aRes = await attendanceService.getByDate(classId, sectionId, date)
        aRes.data.forEach(a => {
          if (initialData[a.studentId]) {
            initialData[a.studentId] = { status: a.status, remarks: a.remarks || '' }
          }
        })
      } catch (err) {
        // Attendance might not exist for this date, ignore
      }
      setAttendanceData(initialData)
    } catch (err) {
      setError('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const promises = students.map(s => {
        return attendanceService.markAttendance({
          studentId: s.id,
          attendanceDate: date,
          date: date,
          status: attendanceData[s.id].status,
          remarks: attendanceData[s.id].remarks
        })
      })
      await Promise.all(promises)
      setSuccess('Attendance marked successfully')
    } catch (err) {
      setError('Failed to mark attendance')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Record Attendance</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Class</label>
            <select value={classId} onChange={handleClassChange}>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Section</label>
            <select value={sectionId} onChange={e => setSectionId(e.target.value)}>
              <option value="">Select Section</option>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" onClick={loadStudents} disabled={!classId || !sectionId || !date}>
              Load Students
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <div className="status-badge active" style={{ padding: '12px', marginBottom: '16px', display: 'block' }}>{success}</div>}

      {students.length > 0 && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.studentId}</td>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>
                    <select 
                      value={attendanceData[s.id]?.status} 
                      onChange={e => setAttendanceData({...attendanceData, [s.id]: {...attendanceData[s.id], status: e.target.value}})}
                      style={{ padding: '4px', borderRadius: '4px' }}
                    >
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="LATE">Late</option>
                    </select>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={attendanceData[s.id]?.remarks} 
                      onChange={e => setAttendanceData({...attendanceData, [s.id]: {...attendanceData[s.id], remarks: e.target.value}})}
                      placeholder="Optional remarks"
                      style={{ padding: '4px', width: '100%' }}
                    />
                  </td>
                  <td>
                    <Link to={`/attendance/student/${s.id}`} className="btn" style={{ background: '#eee', textDecoration: 'none' }}>History</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={handleSubmit}>Save Attendance</button>
          </div>
        </div>
      )}
    </div>
  )
}
