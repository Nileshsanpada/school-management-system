import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Subjects() {
  const { data: subjects, loading, refetch } = useFetch(academicService.subjects.getAll)
  const [formData, setFormData] = useState({ name: '', code: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await academicService.subjects.create(formData)
      setFormData({ name: '', code: '' })
      refetch()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return
    try {
      await academicService.subjects.delete(id)
      refetch()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>Subjects</h1>
      </div>
      
      <div className="form-row">
        <div className="card">
          <h3>Add New</h3>
          <ErrorMessage message={error} />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Subject Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Code (Optional)</label>
              <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
        
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects?.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.code || '-'}</td>
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
