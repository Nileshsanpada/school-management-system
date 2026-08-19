import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { formatDate } from '../../utils/formatDate'

export default function Examinations() {
  const { data: exams, loading, refetch } = useFetch(academicService.examinations.getAll)
  const { data: years } = useFetch(academicService.academicYears.getAll)
  const { data: classes } = useFetch(academicService.classes.getAll)
  
  const [formData, setFormData] = useState({ name: '', examDate: '', academicYearId: '', classId: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await academicService.examinations.create(formData)
      setFormData({ name: '', examDate: '', academicYearId: '', classId: '' })
      refetch()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>Examinations</h1>
      </div>
      
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Add New Examination</h3>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Exam Name (e.g. Mid Term)</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} required />
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
              <label>Class</label>
              <select value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} required>
                <option value="">Select Class</option>
                {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Save Examination</button>
        </form>
      </div>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Academic Year</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {exams?.map(e => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{formatDate(e.examDate)}</td>
                <td>{e.academicYearName}</td>
                <td>{e.className}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
