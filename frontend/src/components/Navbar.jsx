import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'

export default function Navbar({ onToggleSidebar }) {
  const { user, role, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleIcon = () => {
    if (role === 'ADMIN') return '👑'
    if (role === 'TEACHER') return '👨‍🏫'
    if (role === 'PARENT') return '👨‍👩‍👧'
    return '👤'
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
          title="Open Menu"
        >
          ☰
        </button>

        <div className="navbar-title">
          {role === 'ADMIN' && '👑 Admin Management'}
          {role === 'TEACHER' && '👨‍🏫 Faculty Portal'}
          {role === 'PARENT' && '👨‍👩‍👧 Parent Access'}
          {!role && 'School Portal'}
        </div>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle Button */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User Profile Chip - Click to open Profile */}
        <div 
          className="user-chip" 
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }}
          title="Click to view & edit your profile"
        >
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info-text">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role-badge">
              {getRoleIcon()} {role}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)' }}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </header>
  )
}
