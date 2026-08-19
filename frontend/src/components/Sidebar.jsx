import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
  const { role } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          🏫
        </div>
        <div className="sidebar-brand-text">
          <h2>EduCore SMS</h2>
          <span>Enterprise Portal</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {role === 'ADMIN' && (
          <>
            <div className="sidebar-section-title">Main</div>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink to="/admissions" className={({isActive}) => isActive ? 'active' : ''}>
              <span>📝</span> Admissions
            </NavLink>
            <NavLink to="/students" className={({isActive}) => isActive ? 'active' : ''}>
              <span>🎓</span> Students
            </NavLink>
            
            <div className="sidebar-section-title">Academic Master</div>
            <NavLink to="/academic-years" className={({isActive}) => isActive ? 'active' : ''}>
              <span>📅</span> Academic Years
            </NavLink>
            <NavLink to="/classes" className={({isActive}) => isActive ? 'active' : ''}>
              <span>🏫</span> Classes
            </NavLink>
            <NavLink to="/sections" className={({isActive}) => isActive ? 'active' : ''}>
              <span>🔤</span> Sections
            </NavLink>
            <NavLink to="/subjects" className={({isActive}) => isActive ? 'active' : ''}>
              <span>📚</span> Subjects
            </NavLink>
            <NavLink to="/teachers" className={({isActive}) => isActive ? 'active' : ''}>
              <span>👨‍🏫</span> Teachers
            </NavLink>
            
            <div className="sidebar-section-title">Operations & Finance</div>
            <NavLink to="/attendance" className={({isActive}) => isActive ? 'active' : ''}>
              <span>📋</span> Attendance
            </NavLink>
            <NavLink to="/examinations" className={({isActive}) => isActive ? 'active' : ''}>
              <span>✍️</span> Examinations
            </NavLink>
            <NavLink to="/results" className={({isActive}) => isActive ? 'active' : ''}>
              <span>🏆</span> Results
            </NavLink>
            <NavLink to="/fees" className={({isActive}) => isActive ? 'active' : ''}>
              <span>💳</span> Fees Structure
            </NavLink>
            <NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}>
              <span>💵</span> Payments
            </NavLink>
          </>
        )}
        
        {role === 'TEACHER' && (
          <>
            <div className="sidebar-section-title">Faculty Portal</div>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink to="/attendance" className={({isActive}) => isActive ? 'active' : ''}>
              <span>📋</span> Mark Attendance
            </NavLink>
            <NavLink to="/examinations" className={({isActive}) => isActive ? 'active' : ''}>
              <span>✍️</span> Examinations
            </NavLink>
            <NavLink to="/results" className={({isActive}) => isActive ? 'active' : ''}>
              <span>🏆</span> Results Entry
            </NavLink>
          </>
        )}
        
        {role === 'PARENT' && (
          <>
            <div className="sidebar-section-title">Parent Portal</div>
            <NavLink to="/parent/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
              <span>👨‍👩‍👧</span> My Children
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  )
}
