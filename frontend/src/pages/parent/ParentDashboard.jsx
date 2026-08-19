import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import parentService from '../../services/parentService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function ParentDashboard() {
  const { data: profile, loading, error } = useFetch(parentService.getProfile)
  const navigate = useNavigate()

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!profile) return <div>No profile found</div>

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {profile.name}</h1>
      </div>
      
      <h3 style={{ marginBottom: '16px' }}>My Children</h3>
      
      {profile.children && profile.children.length > 0 ? (
        <div className="stats-grid">
          {profile.children.map(child => (
            <div 
              key={child.id} 
              className="card" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => navigate(`/parent/child/${child.id}`)}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ 
                  width: '50px', height: '50px', borderRadius: '25px', 
                  backgroundColor: 'var(--primary)', color: 'white',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '20px', fontWeight: 'bold', marginRight: '16px'
                }}>
                  {child.firstName[0]}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{child.firstName} {child.lastName}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>ID: {child.studentId}</div>
                </div>
              </div>
              <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '4px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}><strong>Class:</strong> {child.className || '-'}</p>
                <p style={{ margin: 0, fontSize: '14px' }}><strong>Section:</strong> {child.sectionName || '-'}</p>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <span className="btn btn-primary" style={{ display: 'inline-block', width: '100%' }}>View Dashboard</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No children associated with this account.</div>
      )}
    </div>
  )
}
