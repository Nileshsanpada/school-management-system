import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import academicService from '../../services/academicService'
import studentService from '../../services/studentService'
import attendanceService from '../../services/attendanceService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Attendance() {
  const [academicYears, setAcademicYears] = useState([])
  const [academicYearId, setAcademicYearId] = useState('')
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

  const sortClasses = (list) => {
    return [...list].sort((a, b) => {
      const numA = parseInt(a.name?.replace(/\D/g, '') || '999', 10)
      const numB = parseInt(b.name?.replace(/\D/g, '') || '999', 10)
      if (numA !== numB) return numA - numB
      return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })
    })
  }

  const sortSections = (list) => {
    return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { numeric: true }))
  }

  useEffect(() => {
    Promise.all([
      academicService.academicYears.getAll(),
      academicService.classes.getAll()
    ])
      .then(([yRes, cRes]) => {
        const yList = yRes.data || []
        setAcademicYears(yList)
        const activeY = yList.find(y => y.active) || yList[0]
        if (activeY) {
          setAcademicYearId(activeY.id)
        }
        setClasses(sortClasses(cRes.data || []))
      })
      .catch(() => setError('Failed to load initial data'))
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
        setSections(sortSections(res.data || []))
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
      const studentsList = sRes.data || []
      setStudents(studentsList)
      
      if (studentsList.length === 0) {
        const selectedClass = classes.find(c => String(c.id) === String(classId))?.name || 'Selected Class'
        const selectedSec = sections.find(s => String(s.id) === String(sectionId))?.name || 'Selected Section'
        setError(`No active students found enrolled in ${selectedClass} (Section ${selectedSec}).`)
        setLoading(false)
        return
      }

      // Initialize all students to PRESENT by default
      const initialData = {}
      studentsList.forEach(s => {
        initialData[s.id] = { status: 'PRESENT', remarks: '' }
      })
      
      // Load existing attendance for this date, class, section if recorded earlier
      try {
        const aRes = await attendanceService.getByDate(classId, sectionId, date)
        if (aRes.data && aRes.data.length > 0) {
          aRes.data.forEach(a => {
            if (initialData[a.studentId]) {
              initialData[a.studentId] = { status: a.status, remarks: a.remarks || '' }
            }
          })
          setSuccess(`📋 Found existing attendance records for ${date}. You can modify and update below.`)
        }
      } catch (err) {
        // Fresh attendance entry
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
    if (!students || students.length === 0) return
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
        setSuccess(`✅ Attendance recorded & saved successfully for all ${successCount} students on ${date}!`)
      } else {
        setSuccess(`✅ Saved attendance for ${successCount} students (${failCount} errors).`)
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
        <div>
          <h1>📋 Daily Attendance Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Select academic year, date, class and section to mark or modify student attendance records
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="form-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="form-group">
            <label>Academic Year</label>
            <select value={academicYearId} onChange={e => setAcademicYearId(e.target.value)}>
              {academicYears.map(y => (
                <option key={y.id} value={y.id}>
                  {y.name} {y.active ? '(Active)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Attendance Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Class (1 to 12)</label>
            <select value={classId} onChange={handleClassChange}>
              <option value="">-- Select Class --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Section</label>
            <select value={sectionId} onChange={e => setSectionId(e.target.value)} disabled={!classId}>
              <option value="">-- Select Section --</option>
              {sections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', minHeight: '42px' }} 
              onClick={loadStudents} 
              disabled={!classId || !sectionId || !date || loading}
            >
              {loading ? 'Loading...' : '🔍 Load Students'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '16px' }}>
          <ErrorMessage message={error} />
          {students.length === 0 && classId && (
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <Link to="/students" className="btn btn-secondary btn-sm">
                🎓 View or Assign Students in Directory →
              </Link>
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="status-badge active" style={{ padding: '14px 18px', marginBottom: '18px', display: 'block', fontSize: '14px' }}>
          {success}
        </div>
      )}

      {students.length > 0 && (
        <div className="card" style={{ overflowX: 'auto' }}>
          {/* Quick Actions Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              <strong>{students.length}</strong> students enrolled &bull; 
              <span style={{ color: '#22c55e', fontWeight: 600 }}> ✓ {presentCount} Present</span> &bull; 
              <span style={{ color: '#ef4444', fontWeight: 600 }}> ✕ {absentCount} Absent</span> &bull; 
              <span style={{ color: '#f59e0b', fontWeight: 600 }}> ⏱ {lateCount} Late</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => markAllAs('PRESENT')}>
                ✓ Mark All Present
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => markAllAs('ABSENT')}>
                ✕ Mark All Absent
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Student ID</th>
                <th>Full Name</th>
                <th style={{ width: '160px' }}>Attendance Status</th>
                <th>Remarks / Notes</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.id} style={{ 
                  backgroundColor: attendanceData[s.id]?.status === 'ABSENT' ? 'rgba(239,68,68,0.08)' : 
                                   attendanceData[s.id]?.status === 'LATE' ? 'rgba(245,158,11,0.08)' : 'transparent' 
                }}>
                  <td>{idx + 1}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12.5px', fontWeight: 600 }}>{s.studentId}</td>
                  <td><strong>{s.firstName} {s.lastName}</strong></td>
                  <td>
                    <select 
                      value={attendanceData[s.id]?.status || 'PRESENT'} 
                      onChange={e => setAttendanceData({...attendanceData, [s.id]: {...attendanceData[s.id], status: e.target.value}})}
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: '700',
                        width: '100%',
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
                      placeholder="Optional notes (e.g. sick leave)"
                      style={{ padding: '8px 12px', width: '100%' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button 
              type="button"
              className="btn btn-primary" 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{ padding: '12px 32px', fontSize: '15px', minWidth: '180px' }}
            >
              {submitting ? '⏳ Saving Records...' : '💾 Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
