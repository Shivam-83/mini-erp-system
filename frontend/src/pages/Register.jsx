import React, { useState } from 'react'
import api from '../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (password.length < 6) {
      return alert('Password must be at least 6 characters long')
    }
    setLoading(true)
    try {
      await api.post('/auth/register', { name, email, password })
      alert('✓ Registration successful! Please login with your credentials.')
      window.location.href = '/login'
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏗️</div>
          <h2>Create Account</h2>
          <p style={{ marginBottom: 0 }}>Join Mini ERP to manage your projects</p>
        </div>
        
        <form className="form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name} 
              onChange={e=>setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email} 
              onChange={e=>setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e=>setPassword(e.target.value)}
              required
              minLength={6}
            />
            <small style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Minimum 6 characters</small>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--gray-600)' }}>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  )
}
