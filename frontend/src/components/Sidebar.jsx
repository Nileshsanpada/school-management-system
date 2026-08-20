import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth()

  const handleNavClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sidebar-logo">
              🏫
            </div>
            <div className="sidebar-brand-text">
              <h2>EduCore SMS</h2>
              <span>Enterprise Portal</span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onClose}
            style={{ width: '32px', height: '32px', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {role === 'ADMIN' && (
            <>
              <div className="sidebar-section-title">Main</div>
              <NavLink to="/dashboard" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>📊</span> Dashboard
              </NavLink>
              <NavLink to="/admissions" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>📝</span> Admissions
              </NavLink>
              <NavLink to="/students" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>🎓</span> Students
              </NavLink>
              
              <div className="sidebar-section-title">Academic Master</div>
              <NavLink to="/academic-years" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>📅</span> Academic Years
              </NavLink>
              <NavLink to="/classes" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>🏫</span> Classes
              </NavLink>
              <NavLink to="/sections" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>🔤</span> Sections
              </NavLink>
              <NavLink to="/subjects" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>📚</span> Subjects
              </NavLink>
              <NavLink to="/teachers" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>👨‍🏫</span> Teachers
              </NavLink>
              
              <div className="sidebar-section-title">Operations & Finance</div>
              <NavLink to="/attendance" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>📋</span> Attendance
              </NavLink>
              <NavLink to="/examinations" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>✍️</span> Examinations
              </NavLink>
              <NavLink to="/results" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>🏆</span> Results
              </NavLink>
              <NavLink to="/fees" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>💳</span> Fees Structure
              </NavLink>
              <NavLink to="/payments" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>💵</span> Payments
              </NavLink>
            </>
          )}
          
          {role === 'TEACHER' && (
            <>
              <div className="sidebar-section-title">Faculty Portal</div>
              <NavLink to="/dashboard" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>📊</span> Dashboard
              </NavLink>
              <NavLink to="/students" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>🎓</span> Students Directory
              </NavLink>
              <NavLink to="/attendance" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>📋</span> Mark Attendance
              </NavLink>
              <NavLink to="/examinations" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>✍️</span> Examinations
              </NavLink>
              <NavLink to="/results" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>🏆</span> Results Entry
              </NavLink>
            </>
          )}
          
          {role === 'PARENT' && (
            <>
              <div className="sidebar-section-title">Parent Portal</div>
              <NavLink to="/parent/dashboard" onClick={handleNavClick} className={({isActive}) => isActive ? 'active' : ''}>
                <span>👨‍👩‍👧</span> My Children
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
