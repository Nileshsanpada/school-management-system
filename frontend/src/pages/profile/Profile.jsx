import { useState, useEffect } from 'react'
import userService from '../../services/userService'
import { useAuth } from '../../hooks/useAuth'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Profile() {
  const { user, login } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    qualification: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswordSection, setShowPasswordSection] = useState(false)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await userService.getProfile()
      setProfile(res.data)
      setFormData({
        name: res.data.name || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        qualification: res.data.qualification || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (showPasswordSection && formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long')
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New password and confirmation do not match')
        return
      }
      if (!formData.currentPassword) {
        setError('Please enter your current password to set a new password')
        return
      }
    }

    setSaving(true)
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        qualification: formData.qualification,
        ...(showPasswordSection && formData.newPassword ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        } : {})
      }

      const res = await userService.updateProfile(payload)
      setProfile(res.data)
      setSuccess('✅ Profile updated successfully!')
      
      // Update local storage user name if changed
      if (user && user.name !== res.data.name) {
        const updatedUser = { ...user, name: res.data.name }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      setShowPasswordSection(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  const getRoleBadgeColor = (role) => {
    if (role === 'ADMIN') return 'var(--primary)'
    if (role === 'TEACHER') return '#10b981'
    if (role === 'PARENT') return '#f59e0b'
    return 'var(--text-muted)'
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1>👤 My Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Manage and update your personal details, credentials and contact preferences
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="status-badge active" style={{ padding: '12px 16px', marginBottom: '20px', display: 'block', fontSize: '14px' }}>
          {success}
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: '800',
          boxShadow: '0 4px 14px var(--primary-glow)',
          flexShrink: 0
        }}>
          {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ flex: '1', minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {profile?.name}
            </h2>
            <span style={{
              background: getRoleBadgeColor(profile?.role),
              color: '#ffffff',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.04em'
            }}>
              {profile?.role}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '4px', margin: 0 }}>
            {profile?.email}
          </p>
          {profile?.employeeId && (
            <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '4px', fontWeight: '600' }}>
              Employee ID: {profile.employeeId}
            </div>
          )}
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '18px', fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Personal Information
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={profile?.email || ''} 
                disabled 
                style={{ opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'var(--bg-surface-elevated)' }} 
              />
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                🔒 Email address is linked to system login credentials.
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                placeholder="e.g. 9876543210"
                value={formData.phone} 
                onChange={e => setFormData({ ...formData, phone: e.target.value })} 
              />
            </div>

            {profile?.role === 'TEACHER' && (
              <div className="form-group">
                <label>Academic Qualification</label>
                <input 
                  type="text" 
                  placeholder="e.g. M.Sc. Mathematics, B.Ed"
                  value={formData.qualification} 
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })} 
                />
              </div>
            )}

            {profile?.role === 'PARENT' && (
              <div className="form-group">
                <label>Residential Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. 104, Green Valley Park, Mumbai"
                  value={formData.address} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })} 
                />
              </div>
            )}
          </div>

          {/* Security & Password Section */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  🔑 Security & Password
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '2px 0 0' }}>
                  {showPasswordSection ? 'Enter your current password and choose a new secure password' : 'Keep your account secure by updating your password'}
                </p>
              </div>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowPasswordSection(prev => !prev)}
              >
                {showPasswordSection ? 'Cancel Password Change' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <div style={{
                background: 'var(--bg-surface-elevated)',
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '16px'
              }}>
                <div className="form-group">
                  <label>Current Password *</label>
                  <input 
                    type="password" 
                    placeholder="Enter current password"
                    value={formData.currentPassword} 
                    onChange={e => setFormData({ ...formData, currentPassword: e.target.value })} 
                    required={showPasswordSection}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>New Password *</label>
                    <input 
                      type="password" 
                      placeholder="Minimum 6 characters"
                      value={formData.newPassword} 
                      onChange={e => setFormData({ ...formData, newPassword: e.target.value })} 
                      required={showPasswordSection}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password *</label>
                    <input 
                      type="password" 
                      placeholder="Re-enter new password"
                      value={formData.confirmPassword} 
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} 
                      required={showPasswordSection}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              style={{ padding: '12px 28px', fontSize: '15px', minWidth: '160px' }}
            >
              {saving ? '⏳ Saving Changes...' : '💾 Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
