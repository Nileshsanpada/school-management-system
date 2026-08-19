import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'
import { useTheme } from '../../context/ThemeContext'
import ErrorMessage from '../../components/ErrorMessage'

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'PARENT' })
  const [touched, setTouched] = useState({ name: false, email: false, password: false })
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  // Real-time Email Validation
  const isEmailValid = useMemo(() => {
    if (!formData.email) return false
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())
  }, [formData.email])

  // Real-time Password Validation
  const isPasswordValid = useMemo(() => {
    return formData.password.length >= 6
  }, [formData.password])

  const passwordScore = useMemo(() => {
    let score = 0
    if (formData.password.length >= 6) score++
    if (formData.password.length >= 8) score++
    if (/[A-Z]/.test(formData.password) || /[0-9]/.test(formData.password)) score++
    return score
  }, [formData.password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setTouched({ name: true, email: true, password: true })

    if (!formData.name.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address (e.g. name@school.com).')
      return
    }

    if (!isPasswordValid) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await authService.register(formData)
      setSuccessMsg('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
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
            Create Account
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Register to join EduCore School System
          </p>
        </div>

        {error && <ErrorMessage message={error} />}
        {successMsg && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid var(--success)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--success)',
            fontSize: '13px',
            marginBottom: '16px',
            fontWeight: '500'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Nilesh Sanpada"
              value={formData.name}
              onChange={e => {
                setFormData({...formData, name: e.target.value})
                setTouched(prev => ({ ...prev, name: true }))
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. nilesh@example.com"
              value={formData.email}
              onChange={e => {
                setFormData({...formData, email: e.target.value})
                setTouched(prev => ({ ...prev, email: true }))
              }}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              className={touched.email ? (isEmailValid ? 'input-valid' : 'input-invalid') : ''}
              required
            />
            {touched.email && (
              <div className={`validation-hint ${isEmailValid ? 'valid' : 'invalid'}`}>
                {isEmailValid ? '✓ Valid email address' : '○ Please enter a valid email format'}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Portal Role</label>
            <select
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="PARENT">👨‍👩‍👧 Parent (View Children's Progress)</option>
              <option value="TEACHER">👨‍🏫 Faculty (Attendance & Exams)</option>
              <option value="ADMIN">👑 Admin (School Management)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={e => {
                setFormData({...formData, password: e.target.value})
                setTouched(prev => ({ ...prev, password: true }))
              }}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              className={touched.password ? (isPasswordValid ? 'input-valid' : 'input-invalid') : ''}
              required
            />
            {touched.password && (
              <div className={`validation-hint ${isPasswordValid ? 'valid' : 'invalid'}`}>
                {isPasswordValid ? '✓ Password meets requirements' : '○ Minimum 6 characters required'}
              </div>
            )}

            {formData.password.length > 0 && (
              <div style={{ marginTop: '6px' }}>
                <div style={{
                  display: 'flex',
                  height: '4px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--border-color)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(passwordScore / 3) * 100}%`,
                    backgroundColor: passwordScore === 1 ? 'var(--danger)' : passwordScore === 2 ? 'var(--warning)' : 'var(--success)',
                    transition: 'all 0.3s ease'
                  }} />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
