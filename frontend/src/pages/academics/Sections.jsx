import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Sections() {
  const { data: sections, loading: sLoading, refetch } = useFetch(academicService.sections.getAll)
  const { data: classes } = useFetch(academicService.classes.getAll)
  const [formData, setFormData] = useState({ name: '', classId: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await academicService.sections.create(formData)
      setFormData({ name: '', classId: '' })
      refetch()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section?')) return
    try {
      await academicService.sections.delete(id)
      refetch()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  if (sLoading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>Sections</h1>
      </div>
      
      <div className="form-row">
        <div className="card">
          <h3>Add New</h3>
          <ErrorMessage message={error} />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Section Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Class</label>
              <select value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} required>
                <option value="">Select Class</option>
                {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
        
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections?.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.className}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
