import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { formatDate } from '../../utils/formatDate'

export default function AcademicYears() {
  const { data: years, loading, error, refetch } = useFetch(academicService.academicYears.getAll)
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', active: false })
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await academicService.academicYears.create(formData)
      setFormData({ name: '', startDate: '', endDate: '', active: false })
      refetch()
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this academic year?')) return
    try {
      await academicService.academicYears.delete(id)
      refetch()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>Academic Years</h1>
      </div>
      
      <div className="form-row">
        <div className="card">
          <h3>Add New</h3>
          <ErrorMessage message={submitError || error} />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name (e.g. 2023-2024)</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} style={{ width: 'auto' }} />
              <label style={{ margin: 0 }}>Active Year</label>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
        
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {years?.map(y => (
                <tr key={y.id}>
                  <td>{y.name}</td>
                  <td>{formatDate(y.startDate)}</td>
                  <td>{formatDate(y.endDate)}</td>
                  <td>
                    {y.active ? <span className="status-badge active">Active</span> : <span className="status-badge">Inactive</span>}
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(y.id)}>Delete</button>
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
