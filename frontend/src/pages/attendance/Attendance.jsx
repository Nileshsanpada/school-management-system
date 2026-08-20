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
  const [submitting, setSubmitting] = useState(false)
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
    setSuccess('')
    setError('')
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
      
      if (studentsList.length === 0) {
        setError('No students found in this Class/Section. Please check if students are assigned to this section.')
        setLoading(false)
        return
      }

      // Initialize all students to PRESENT by default
      const initialData = {}
      studentsList.forEach(s => {
        initialData[s.id] = { status: 'PRESENT', remarks: '' }
      })
      
      // Try to load existing attendance for this date, class, section
      try {
        const aRes = await attendanceService.getByDate(classId, sectionId, date)
        if (aRes.data && aRes.data.length > 0) {
          aRes.data.forEach(a => {
            if (initialData[a.studentId]) {
              initialData[a.studentId] = { status: a.status, remarks: a.remarks || '' }
            }
          })
          setSuccess(`Loaded existing attendance for ${date}. You can update and re-save.`)
        }
      } catch (err) {
        // Existing attendance not found — fresh entry, which is fine
      }
      setAttendanceData(initialData)
    } catch (err) {
      setError('Failed to load students. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const markAllAs = (status) => {
    const updated = {}
    students.forEach(s => {
      updated[s.id] = { ...attendanceData[s.id], status }
    })
    setAttendanceData(updated)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      let successCount = 0
      let failCount = 0
      
      for (const s of students) {
        try {
          await attendanceService.markAttendance({
            studentId: s.id,
            attendanceDate: date,
            date: date,
            status: attendanceData[s.id]?.status || 'PRESENT',
            remarks: attendanceData[s.id]?.remarks || ''
          })
          successCount++
        } catch (err) {
          failCount++
        }
      }
      
      if (failCount === 0) {
        setSuccess(`✅ Attendance saved successfully for all ${successCount} students!`)
      } else {
        setSuccess(`Saved ${successCount} students. ${failCount} had issues (may already be recorded).`)
      }
    } catch (err) {
      setError('Failed to save attendance. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const presentCount = Object.values(attendanceData).filter(a => a.status === 'PRESENT').length
  const absentCount = Object.values(attendanceData).filter(a => a.status === 'ABSENT').length
  const lateCount = Object.values(attendanceData).filter(a => a.status === 'LATE').length

  return (
    <div>
      <div className="page-header">
        <h1>📋 Record Attendance</h1>
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
            <button className="btn btn-primary" onClick={loadStudents} disabled={!classId || !sectionId || !date || loading}>
              {loading ? 'Loading...' : '🔍 Load Students'}
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <div className="status-badge active" style={{ padding: '12px', marginBottom: '16px', display: 'block', fontSize: '14px' }}>{success}</div>}

      {students.length > 0 && (
        <div className="card" style={{ overflowX: 'auto' }}>
          {/* Quick Actions Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              <strong>{students.length}</strong> students loaded | 
              <span style={{ color: '#22c55e' }}> ✓ {presentCount} Present</span> | 
              <span style={{ color: '#ef4444' }}> ✕ {absentCount} Absent</span> | 
              <span style={{ color: '#f59e0b' }}> ⏱ {lateCount} Late</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => markAllAs('PRESENT')}>
                All Present
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => markAllAs('ABSENT')}>
                All Absent
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.id} style={{ 
                  backgroundColor: attendanceData[s.id]?.status === 'ABSENT' ? 'rgba(239,68,68,0.08)' : 
                                   attendanceData[s.id]?.status === 'LATE' ? 'rgba(245,158,11,0.08)' : 'transparent' 
                }}>
                  <td>{idx + 1}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{s.studentId}</td>
                  <td><strong>{s.firstName} {s.lastName}</strong></td>
                  <td>
                    <select 
                      value={attendanceData[s.id]?.status || 'PRESENT'} 
                      onChange={e => setAttendanceData({...attendanceData, [s.id]: {...attendanceData[s.id], status: e.target.value}})}
                      style={{ 
                        padding: '6px 10px', 
                        borderRadius: '6px',
                        fontWeight: '600',
                        color: attendanceData[s.id]?.status === 'PRESENT' ? '#22c55e' : 
                               attendanceData[s.id]?.status === 'ABSENT' ? '#ef4444' : '#f59e0b'
                      }}
                    >
                      <option value="PRESENT">✓ Present</option>
                      <option value="ABSENT">✕ Absent</option>
                      <option value="LATE">⏱ Late</option>
                    </select>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={attendanceData[s.id]?.remarks || ''} 
                      onChange={e => setAttendanceData({...attendanceData, [s.id]: {...attendanceData[s.id], remarks: e.target.value}})}
                      placeholder="Optional remarks"
                      style={{ padding: '6px 10px', width: '100%' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{ padding: '12px 28px', fontSize: '15px' }}
            >
              {submitting ? '⏳ Saving Attendance...' : '💾 Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
