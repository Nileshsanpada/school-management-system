import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import ErrorMessage from '../../components/ErrorMessage'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSeconds, setLoadingSeconds] = useState(0)
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  // Track loading seconds for Render Cold Start indicator
  useEffect(() => {
    let interval
    if (loading) {
      setLoadingSeconds(0)
      interval = setInterval(() => {
        setLoadingSeconds(prev => prev + 1)
      }, 1000)
    } else {
      setLoadingSeconds(0)
    }
    return () => clearInterval(interval)
  }, [loading])

  // Real-time Email validation check
  const isEmailValid = useMemo(() => {
    if (!email) return false
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
  }, [email])

  const isPasswordValid = useMemo(() => {
    return password.length >= 6
  }, [password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setTouched({ email: true, password: true })

    if (!isEmailValid) {
      setError('Please enter a valid email address (e.g. admin@school.com).')
      return
    }

    if (!isPasswordValid) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await authService.login({ email, password })
      const { token, name, email: userEmail, role } = res.data
      const userData = { name, email: userEmail, role }
      login(token, userData)
      if (role === 'ADMIN') navigate('/dashboard')
      else if (role === 'PARENT') navigate('/parent/dashboard')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setTouched({ email: true, password: true })
    setError('')
  }

  return (
    <div className="auth-container">
      {/* Theme Toggle Button */}
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        style={{ position: 'absolute', top: '20px', right: '20px' }}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            fontSize: '32px',
            width: '60px',
            height: '60px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 16px var(--primary-glow)'
          }}>
            🏫
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            EduCore SMS
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sign in to access your school portal
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading && loadingSeconds >= 2 && (
          <div style={{
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
            <div>
              <strong>Cloud Server Waking Up ({loadingSeconds}s)...</strong>
              <div style={{ fontSize: '11.5px', opacity: 0.85, marginTop: '2px' }}>
                Free-tier cold start in progress. Logging in momentarily!
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. admin@school.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                setTouched(prev => ({ ...prev, email: true }))
              }}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              className={touched.email ? (isEmailValid ? 'input-valid' : 'input-invalid') : ''}
              required
            />
            {touched.email && (
              <div className={`validation-hint ${isEmailValid ? 'valid' : 'invalid'}`}>
                {isEmailValid ? '✓ Valid email format' : '○ Please enter a valid email with @ domain'}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setTouched(prev => ({ ...prev, password: true }))
              }}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              className={touched.password ? (isPasswordValid ? 'input-valid' : 'input-invalid') : ''}
              required
            />
            {touched.password && (
              <div className={`validation-hint ${isPasswordValid ? 'valid' : 'invalid'}`}>
                {isPasswordValid ? '✓ Password format met' : '○ Minimum 6 characters required'}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '6px' }}
          >
            {loading ? (loadingSeconds > 2 ? `Waking Server (${loadingSeconds}s)...` : 'Signing In...') : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '22px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '10px',
            letterSpacing: '0.05em'
          }}>
            ⚡ 1-Click Demo Logins:
          </div>
          <div className="auth-demo-grid">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 4px' }}
              onClick={() => fillDemoCredentials('admin@school.com', 'admin123')}
            >
              👑 Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 4px' }}
              onClick={() => fillDemoCredentials('teacher@school.com', 'teacher123')}
            >
              👨‍🏫 Teacher
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 4px' }}
              onClick={() => fillDemoCredentials('parent@school.com', 'parent123')}
            >
              👨‍👩‍👧 Parent
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
