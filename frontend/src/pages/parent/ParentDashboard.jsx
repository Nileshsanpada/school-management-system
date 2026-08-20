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
        <div>
          <h1>Welcome, {profile.name} 👋</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            EduCore Guardian Portal &mdash; Comprehensive academic records, attendance metrics, and fee management
          </p>
        </div>
      </div>
      
      <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>Enrolled Students</h3>
      
      {profile.children && profile.children.length > 0 ? (
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {profile.children.map(child => (
            <div 
              key={child.id} 
              className="card" 
              style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }}
              onClick={() => navigate(`/parent/child/${child.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '14px' }}>
                <div style={{ 
                  width: '52px', height: '52px', borderRadius: 'var(--radius-md)', 
                  background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', color: '#ffffff',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '22px', fontWeight: '800',
                  boxShadow: '0 4px 12px var(--primary-glow)'
                }}>
                  {child.firstName[0]}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {child.firstName} {child.lastName}
                  </h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    Student ID: <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{child.studentId}</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                background: 'var(--bg-surface-elevated)', 
                padding: '14px', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-color)',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                fontSize: '13px'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Class:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{child.className || '-'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Section:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{child.sectionName || '-'}</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Academic Year:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{child.academicYearName || '2026-2027'}</strong>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                  View Student Dashboard →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            fontSize: '36px',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--primary)'
          }}>
            👨‍👩‍👧
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Student Records Associated Yet
          </h3>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '24px' }}>
            Your guardian account is active, but no enrolled student profile is currently mapped to <strong>{profile.email}</strong>.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginBottom: '28px',
            textAlign: 'left',
            background: 'var(--bg-surface-elevated)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '13.5px',
            lineHeight: '1.5'
          }}>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>
              📋 Student Enrollment & Association Process:
            </div>
            <div>
              <strong>1. Submit Admission Application:</strong> Complete the online student registration form. The guardian email will automatically match <em>{profile.email}</em>.
            </div>
            <div>
              <strong>2. Administrative Review & Approval:</strong> School administration will verify student records and confirm the official enrollment.
            </div>
            <div>
              <strong>3. Automated Synchronization:</strong> Upon confirmation, your student's unique ID, daily attendance, grade reports, and fee records will automatically appear in this portal.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              type="button"
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '14.5px' }}
              onClick={() => navigate('/admissions/new')}
            >
              📝 Apply for Student Admission
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
