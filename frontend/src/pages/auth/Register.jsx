import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'
import { useTheme } from '../../context/ThemeContext'
import ErrorMessage from '../../components/ErrorMessage'

export default function Register() {
  const [step, setStep] = useState(1) // Step 1: Info & Password, Step 2: OTP Verification
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'PARENT', otp: '' })
  const [otpPreview, setOtpPreview] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  // Live password complexity checks
  const passwordChecks = useMemo(() => {
    const p = formData.password
    return {
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[@#$%^&+=!._-]/.test(p)
    }
  }, [formData.password])

  const isPasswordValid = Object.values(passwordChecks).every(Boolean)

  const passwordScore = useMemo(() => {
    return Object.values(passwordChecks).filter(Boolean).length
  }, [passwordChecks])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!formData.name.trim()) {
      setError('Please enter your full name.')
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    if (!isPasswordValid) {
      setError('Password must meet all complexity requirements before proceeding.')
      return
    }

    setLoading(true)
    try {
      const res = await authService.sendOtp(formData.email)
      setOtpPreview(res.data.otpPreview || '')
      setSuccessMsg(`Verification code sent to ${formData.email}!`)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code. Please check your email and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!formData.otp || formData.otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit verification code.')
      return
    }

    setLoading(true)
    try {
      await authService.register(formData)
      setSuccessMsg('Account registered & verified successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Invalid or expired OTP code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-page)',
      backgroundImage: 'radial-gradient(at 0% 0%, var(--primary-glow) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%)',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Theme Toggle Button */}
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        style={{ position: 'absolute', top: '24px', right: '24px' }}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '38px 34px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            fontSize: '32px',
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 16px var(--primary-glow)'
          }}>
            🏫
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {step === 1 ? 'Create Account' : 'Verify Your Email'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {step === 1 ? 'Register to join EduCore School System' : `Enter the 6-digit code sent to ${formData.email}`}
          </p>

          {/* Stepper Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-card)',
            padding: '6px 14px',
            borderRadius: '999px',
            marginTop: '14px',
            border: '1px solid var(--border-color)',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            <span style={{ color: step === 1 ? 'var(--primary)' : 'var(--success)' }}>
              {step === 1 ? '● Step 1: Account Info' : '✓ Step 1: Info'}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <span style={{ color: step === 2 ? 'var(--primary)' : 'var(--text-muted)' }}>
              ● Step 2: Email OTP
            </span>
          </div>
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

        {/* STEP 1: Registration Form & Password Validation */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. John Sharma"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address (Must be valid)</label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
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

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label>Password (Strict Validation)</label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />

              {/* Password Strength Meter */}
              {formData.password.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{
                    display: 'flex',
                    height: '5px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--border-color)',
                    overflow: 'hidden',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      width: `${(passwordScore / 5) * 100}%`,
                      backgroundColor: passwordScore <= 2 ? 'var(--danger)' : passwordScore <= 4 ? 'var(--warning)' : 'var(--success)',
                      transition: 'all 0.3s ease'
                    }} />
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '4px',
                    fontSize: '11px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{ color: passwordChecks.length ? 'var(--success)' : 'var(--text-muted)' }}>
                      {passwordChecks.length ? '✓' : '○'} Min 8 Characters
                    </span>
                    <span style={{ color: passwordChecks.upper ? 'var(--success)' : 'var(--text-muted)' }}>
                      {passwordChecks.upper ? '✓' : '○'} 1 Uppercase (A-Z)
                    </span>
                    <span style={{ color: passwordChecks.lower ? 'var(--success)' : 'var(--text-muted)' }}>
                      {passwordChecks.lower ? '✓' : '○'} 1 Lowercase (a-z)
                    </span>
                    <span style={{ color: passwordChecks.number ? 'var(--success)' : 'var(--text-muted)' }}>
                      {passwordChecks.number ? '✓' : '○'} 1 Number (0-9)
                    </span>
                    <span style={{ gridColumn: 'span 2', color: passwordChecks.special ? 'var(--success)' : 'var(--text-muted)' }}>
                      {passwordChecks.special ? '✓' : '○'} 1 Special Character (@, #, $, %, !, _, -)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !isPasswordValid}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                marginTop: '12px',
                opacity: (!isPasswordValid || loading) ? 0.7 : 1
              }}
            >
              {loading ? 'Sending Code...' : 'Verify Email & Continue →'}
            </button>
          </form>
        )}

        {/* STEP 2: Email OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister}>
            {otpPreview && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px dashed var(--primary)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  📩 Instant Verification Code (Demo Mode):
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '6px', color: 'var(--primary)', margin: '6px 0' }}>
                  {otpPreview}
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, otp: otpPreview})}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 10px', marginTop: '4px' }}
                >
                  ⚡ Auto-Fill Code
                </button>
              </div>
            )}

            <div className="form-group">
              <label>Enter 6-Digit OTP</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={formData.otp}
                onChange={e => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                style={{
                  fontSize: '22px',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: '700',
                  padding: '12px'
                }}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || formData.otp.length !== 6}
              style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}
            >
              {loading ? 'Verifying & Creating...' : 'Verify & Register Account ✓'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '12px' }}
              >
                ← Back to Edit
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="btn btn-secondary btn-sm"
                disabled={loading}
                style={{ fontSize: '12px' }}
              >
                🔄 Resend Code
              </button>
            </div>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
