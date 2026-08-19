import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import resultService from '../../services/resultService'
import studentService from '../../services/studentService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import ResultTable from '../../components/ResultTable'

export default function Results() {
  const { data: exams, loading: eLoading } = useFetch(academicService.examinations.getAll)
  const { data: subjects } = useFetch(academicService.subjects.getAll)
  const { data: classes } = useFetch(academicService.classes.getAll)
  
  const [classId, setClassId] = useState('')
  const [examId, setExamId] = useState('')
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [marksObtained, setMarksObtained] = useState('')
  const [maximumMarks, setMaximumMarks] = useState('100')
  
  const [results, setResults] = useState([])
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

  const loadResults = async (eId = examId) => {
    if (!eId) return
    try {
      const res = await resultService.getByExamination(eId)
      setResults(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleExamChange = (e) => {
    setExamId(e.target.value)
    loadResults(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await resultService.create({
        studentId, examId, subjectId, 
        marksObtained: Number(marksObtained), 
        maximumMarks: Number(maximumMarks)
      })
      setSuccess('Result added successfully')
      setSubjectId('')
      setMarksObtained('')
      loadResults()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add result')
    }
  }

  if (eLoading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>Results Entry</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Enter Marks</h3>
        <ErrorMessage message={error} />
        {success && <div className="status-badge active" style={{ padding: '12px', marginBottom: '16px', display: 'block' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Examination</label>
              <select value={examId} onChange={handleExamChange} required>
                <option value="">Select Exam</option>
                {exams?.map(e => <option key={e.id} value={e.id}>{e.name} ({e.className})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Filter Students by Class</label>
              <select value={classId} onChange={handleClassChange}>
                <option value="">Select Class</option>
                {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Student</label>
              <select value={studentId} onChange={e => setStudentId(e.target.value)} required>
                <option value="">Select Student</option>
                {students?.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentId})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <select value={subjectId} onChange={e => setSubjectId(e.target.value)} required>
                <option value="">Select Subject</option>
                {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Marks Obtained</label>
              <input type="number" step="0.01" value={marksObtained} onChange={e => setMarksObtained(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Maximum Marks</label>
              <input type="number" step="0.01" value={maximumMarks} onChange={e => setMaximumMarks(e.target.value)} required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={!examId || !studentId || !subjectId}>Add Result</button>
        </form>
      </div>

      {examId && (
        <>
          <h3 style={{ marginBottom: '16px' }}>Results for Selected Examination</h3>
          <ResultTable results={results} />
        </>
      )}
    </div>
  )
}
