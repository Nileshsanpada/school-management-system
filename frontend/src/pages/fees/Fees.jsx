import { useState, useEffect } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import studentService from '../../services/studentService'
import feeService from '../../services/feeService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import FeeTable from '../../components/FeeTable'

export default function Fees() {
  const { data: years, loading: yLoading } = useFetch(academicService.academicYears.getAll)
  const { data: classes } = useFetch(academicService.classes.getAll)
  
  const [classId, setClassId] = useState('')
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [fees, setFees] = useState([])
  const [showOverdue, setShowOverdue] = useState(false)
  
  const [formData, setFormData] = useState({ academicYearId: '', totalAmount: '', dueDate: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleClassChange = async (e) => {
    const cid = e.target.value
    setClassId(cid)
    if (cid) {
      try {
        const res = await studentService.getByClass(cid)
        setStudents(res.data)
      } catch (err) {
        setStudents([])
      }
    }
  }

  const loadFees = async (sid = studentId) => {
    if (!sid) return
    try {
      const res = await feeService.getByStudent(sid)
      setFees(res.data)
      setShowOverdue(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStudentChange = (e) => {
    setStudentId(e.target.value)
    loadFees(e.target.value)
  }

  const loadOverdue = async () => {
    try {
      const res = await feeService.getOverdue()
      setFees(res.data)
      setShowOverdue(true)
      setStudentId('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await feeService.create({
        studentId,
        academicYearId: formData.academicYearId,
        totalAmount: Number(formData.totalAmount),
        dueDate: formData.dueDate
      })
      setSuccess('Fee assigned successfully')
      setFormData({ ...formData, totalAmount: '' })
      loadFees()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign fee')
    }
  }

  if (yLoading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>Fee Management</h1>
        <button className="btn btn-danger" onClick={loadOverdue}>View Overdue Fees</button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Assign Fee</h3>
        <ErrorMessage message={error} />
        {success && <div className="status-badge active" style={{ padding: '12px', marginBottom: '16px', display: 'block' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Filter Students by Class</label>
              <select value={classId} onChange={handleClassChange}>
                <option value="">Select Class</option>
                {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Student</label>
              <select value={studentId} onChange={handleStudentChange} required>
                <option value="">Select Student</option>
                {students?.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentId})</option>)}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Academic Year</label>
              <select value={formData.academicYearId} onChange={e => setFormData({...formData, academicYearId: e.target.value})} required>
                <option value="">Select Year</option>
                {years?.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Total Amount</label>
              <input type="number" step="0.01" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} required />
            </div>
          </div>
          
          <div className="form-group" style={{ maxWidth: 'calc(50% - 8px)' }}>
            <label>Due Date</label>
            <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={!studentId}>Assign Fee</button>
        </form>
      </div>

      {(studentId || showOverdue) && (
        <>
          <h3 style={{ marginBottom: '16px' }}>{showOverdue ? 'Overdue Fees' : 'Student Fees'}</h3>
          <FeeTable fees={fees} />
        </>
      )}
    </div>
  )
}
