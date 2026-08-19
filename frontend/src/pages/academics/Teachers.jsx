import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Teachers() {
  const { data: teachers, loading, refetch } = useFetch(academicService.teachers.getAll)
  const [formData, setFormData] = useState({ employeeId: '', name: '', email: '', phone: '', qualification: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await academicService.teachers.create(formData)
      setFormData({ employeeId: '', name: '', email: '', phone: '', qualification: '' })
      refetch()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return
    try {
      await academicService.teachers.delete(id)
      refetch()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>Teachers</h1>
      </div>
      
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Add New Teacher</h3>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Employee ID</label>
              <input type="text" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Qualification</label>
            <input type="text" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary">Save Teacher</button>
        </form>
      </div>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Qualification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers?.map(t => (
              <tr key={t.id}>
                <td>{t.employeeId}</td>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone || '-'}</td>
                <td>{t.qualification || '-'}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
