import React, { useState } from 'react'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      window.location.href = '/'
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏗️</div>
          <h2>Welcome Back</h2>
          <p style={{ marginBottom: 0 }}>Sign in to your Mini ERP account</p>
        </div>
        
        <form className="form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email} 
              onChange={e=>setEmail(e.target.value)}
              required
              autoFocus
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
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--gray-600)' }}>
          Don't have an account? <a href="/register">Create one</a>
        </p>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: '8px', fontSize: '0.875rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>🔑 Demo Credentials:</strong>
          <div style={{ color: 'var(--gray-600)' }}>Email: admin@example.com</div>
          <div style={{ color: 'var(--gray-600)' }}>Password: admin123</div>
        </div>
      </div>
    </div>
  )
}
