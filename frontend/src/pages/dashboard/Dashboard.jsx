import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { useAuth } from '../../hooks/useAuth'
import dashboardService from '../../services/dashboardService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Dashboard() {
  const { role, user } = useAuth()
  const { data, loading, error } = useFetch(dashboardService.getSummary)

  if (loading) return <Loading />

  const summary = data || {
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmissions: 0,
    pendingAdmissions: 0,
    confirmedAdmissions: 0,
    totalFees: 0,
    totalCollected: 0,
    totalOutstanding: 0,
    todayAttendance: 0,
    lowAttendanceStudents: []
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Here is the summary of today's school operations ({role} View)
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Main KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>Total Students</h3>
            <div className="stat-value">{summary.totalStudents}</div>
            <div className="stat-subtext">Active enrollments</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">👨‍🏫</div>
          <div className="stat-content">
            <h3>Total Faculty</h3>
            <div className="stat-value">{summary.totalTeachers}</div>
            <div className="stat-subtext">Qualified instructors</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">📋</div>
          <div className="stat-content">
            <h3>Today's Attendance</h3>
            <div className="stat-value">{summary.todayAttendance}</div>
            <div className="stat-subtext">Marked present today</div>
          </div>
        </div>

        {role === 'ADMIN' && (
          <div className="stat-card">
            <div className="stat-icon warning">📝</div>
            <div className="stat-content">
              <h3>Pending Admissions</h3>
              <div className="stat-value" style={{ color: 'var(--warning-text)' }}>{summary.pendingAdmissions}</div>
              <div className="stat-subtext">Awaiting confirmation</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 className="card-title" style={{ marginBottom: '14px' }}>⚡ Quick Operations</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link to="/attendance" className="btn btn-primary">
            <span>📋</span> Mark Attendance
          </Link>
          <Link to="/examinations" className="btn btn-secondary">
            <span>✍️</span> Examinations
          </Link>
          <Link to="/results" className="btn btn-secondary">
            <span>🏆</span> Enter Results
          </Link>
          {role === 'ADMIN' && (
            <>
              <Link to="/admissions" className="btn btn-secondary">
                <span>📝</span> New Admission
              </Link>
              <Link to="/classes" className="btn btn-secondary">
                <span>🏫</span> Manage Classes
              </Link>
              <Link to="/payments" className="btn btn-secondary">
                <span>💵</span> Collect Payment
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Financial Overview for Admin */}
      {role === 'ADMIN' && (
        <div style={{ marginTop: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>
            💳 Financial Overview & Collections
          </h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon info">💳</div>
              <div className="stat-content">
                <h3>Total Fees Invoiced</h3>
                <div className="stat-value">₹{(summary.totalFees || 0).toLocaleString('en-IN')}</div>
                <div className="stat-subtext">Active academic year</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success">💵</div>
              <div className="stat-content">
                <h3>Total Collected</h3>
                <div className="stat-value" style={{ color: 'var(--success)' }}>
                  ₹{(summary.totalCollected || 0).toLocaleString('en-IN')}
                </div>
                <div className="stat-subtext">Settled payments</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon danger">⚠️</div>
              <div className="stat-content">
                <h3>Total Outstanding</h3>
                <div className="stat-value" style={{ color: 'var(--danger)' }}>
                  ₹{(summary.totalOutstanding || 0).toLocaleString('en-IN')}
                </div>
                <div className="stat-subtext">Pending student dues</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low Attendance Alert */}
      {summary.lowAttendanceStudents && summary.lowAttendanceStudents.length > 0 && (
        <div style={{ marginTop: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#b91c1c' }}>
            ⚠️ Low Attendance Warning (&lt; 75%)
          </h3>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th style={{ textAlign: 'right' }}>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {summary.lowAttendanceStudents.map((s, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '600' }}>{s.studentId}</td>
                    <td>{s.studentName}</td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: '#ef4444' }}>
                      {s.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
