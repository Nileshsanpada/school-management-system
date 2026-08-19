import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import admissionService from '../../services/admissionService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { formatDate } from '../../utils/formatDate'

export default function AdmissionList() {
  const [filter, setFilter] = useState('ALL')
  const { data: admissions, loading, error } = useFetch(admissionService.getAll)
  const navigate = useNavigate()

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  const filteredAdmissions = filter === 'ALL' 
    ? admissions 
    : admissions?.filter(a => a.status === filter) || []

  return (
    <div>
      <div className="page-header">
        <h1>Admissions</h1>
        <div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ marginRight: '16px', padding: '8px', borderRadius: '4px' }}>
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button className="btn btn-primary" onClick={() => navigate('/admissions/new')}>New Admission</button>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>App Number</th>
              <th>Student Name</th>
              <th>Parent Name</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmissions.map(adm => (
              <tr key={adm.id}>
                <td>{adm.applicationNumber || '-'}</td>
                <td>{adm.studentName}</td>
                <td>{adm.parentName}</td>
                <td><span className={`status-badge ${adm.status}`}>{adm.status}</span></td>
                <td>{formatDate(adm.applicationDate)}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => navigate(`/admissions/${adm.id}`)}>View</button>
                </td>
              </tr>
            ))}
            {filteredAdmissions.length === 0 && (
              <tr><td colSpan="6" className="empty-state">No admissions found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
