import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
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
        <div className="navbar-title">
          {role === 'ADMIN' && '👑 Admin Management Console'}
          {role === 'TEACHER' && '👨‍🏫 Faculty & Academic Portal'}
          {role === 'PARENT' && '👨‍👩‍👧 Parent Access Portal'}
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

        {/* User Profile Chip */}
        <div className="user-chip">
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
          style={{ padding: '8px 14px', borderRadius: 'var(--radius-full)' }}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </header>
  )
}
