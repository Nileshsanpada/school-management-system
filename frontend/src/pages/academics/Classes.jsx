import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import academicService from '../../services/academicService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Classes() {
  const { data: classes, loading, error, refetch } = useFetch(academicService.classes.getAll)
  const [name, setName] = useState('')
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    try {
      await academicService.classes.create({ name })
      setName('')
      refetch()
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create class')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return
    try {
      await academicService.classes.delete(id)
      refetch()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete class')
    }
  }

  if (loading) return <Loading />

  const sortedClasses = [...(classes || [])].sort((a, b) => {
    const numA = parseInt(a.name?.replace(/\D/g, '') || '999', 10)
    const numB = parseInt(b.name?.replace(/\D/g, '') || '999', 10)
    if (numA !== numB) return numA - numB
    return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })
  })

  return (
    <div>
      <div className="page-header">
        <h1>Class Management</h1>
      </div>
      
      <div className="form-row">
        <div className="card">
          <h3>Add New Class</h3>
          {submitError && <ErrorMessage message={submitError} />}
          {error && <ErrorMessage message={error} />}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Class Name (e.g. Class 10, Grade 5)</label>
              <input
                type="text"
                placeholder="Enter class name..."
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              + Add Class
            </button>
          </form>
        </div>
        
        <div className="card">
          <h3>Existing Classes ({classes?.length || 0})</h3>
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!sortedClasses || sortedClasses.length === 0) ? (
                <tr>
                  <td colSpan="2" className="empty-state">
                    No classes added yet. Use the form on the left to create one.
                  </td>
                </tr>
              ) : (
                sortedClasses.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '600' }}>{c.name}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-danger" style={{ fontSize: '12px', padding: '5px 12px' }} onClick={() => handleDelete(c.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
