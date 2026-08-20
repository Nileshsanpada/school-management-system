import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Sections() {
  const { data: sections, loading: sLoading, refetch } = useFetch(academicService.sections.getAll)
  const { data: classes } = useFetch(academicService.classes.getAll)
  const { data: years } = useFetch(academicService.academicYears.getAll)
  
  const [formData, setFormData] = useState({ name: '', classId: '', academicYearId: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await academicService.sections.create({
        name: formData.name,
        classId: Number(formData.classId),
        academicYearId: formData.academicYearId ? Number(formData.academicYearId) : undefined
      })
      setSuccess('Section created successfully')
      setFormData({ name: '', classId: '', academicYearId: '' })
      refetch()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create section')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return
    try {
      await academicService.sections.delete(id)
      refetch()
    } catch (err) {
      alert('Failed to delete section')
    }
  }

  if (sLoading) return <Loading />

  return (
    <div>
      <div className="page-header">
        <h1>Sections Management</h1>
      </div>
      
      <div className="form-row">
        <div className="card" style={{ flex: '1' }}>
          <h3>Add New Section</h3>
          <ErrorMessage message={error} />
          {success && <div className="status-badge active" style={{ padding: '10px', marginBottom: '14px', display: 'block' }}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Section Name</label>
              <input 
                type="text" 
                placeholder="e.g. A, B, C, Rose, Lotus" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Class</label>
              <select value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} required>
                <option value="">Select Class</option>
                {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Academic Year (Optional)</label>
              <select value={formData.academicYearId} onChange={e => setFormData({...formData, academicYearId: e.target.value})}>
                <option value="">Active Academic Year (Default)</option>
                {years?.map(y => <option key={y.id} value={y.id}>{y.name} {y.active ? '(Active)' : ''}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Section</button>
          </form>
        </div>
        
        <div className="card table-container" style={{ flex: '2', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '14px' }}>All Sections</h3>
          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>Class</th>
                <th>Academic Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections && sections.length > 0 ? (
                sections.map(s => (
                  <tr key={s.id}>
                    <td><strong>Section {s.name}</strong></td>
                    <td>{s.schoolClass?.name || s.className || '-'}</td>
                    <td>{s.academicYear?.name || '-'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-state">No sections found. Add your first section above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
