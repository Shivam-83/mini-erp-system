import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Admin(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  async function load(){
    try{
      setLoading(true)
      const { data } = await api.get('/users')
      setUsers(data.users || [])
    }catch(e){ 
      alert('Failed to load users: ' + (e.response?.data?.message || 'Unknown error'))
    } finally{ 
      setLoading(false) 
    }
  }

  useEffect(()=>{ load() },[])

  async function setRole(id, role){
    try{
      await api.put(`/users/${id}/role`, { role })
      alert(`✓ User role updated to ${role}`)
      load()
    }catch(e){ 
      alert('Update failed: ' + (e.response?.data?.message || 'Unknown error'))
    }
  }

  async function remove(id){
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    try{ 
      await api.delete(`/users/${id}`)
      alert('✓ User deleted successfully')
      load()
    }catch(e){ 
      alert('Delete failed: ' + (e.response?.data?.message || 'Unknown error'))
    }
  }

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    users: users.filter(u => u.role === 'user').length
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">User Administration</h1>
          <p className="page-subtitle">Manage user accounts and permissions</p>
        </div>

        <div className="grid">
          <div className="stat-card" style={{ '--accent': '#2563eb' }}>
            <div className="stat-icon" style={{ background: '#dbeafe' }}>👥</div>
            <p className="stat-label">Total Users</p>
            <h2 className="stat-value">{stats.total}</h2>
          </div>
          <div className="stat-card" style={{ '--accent': '#8b5cf6' }}>
            <div className="stat-icon" style={{ background: '#ede9fe' }}>🔑</div>
            <p className="stat-label">Administrators</p>
            <h2 className="stat-value">{stats.admins}</h2>
          </div>
          <div className="stat-card" style={{ '--accent': '#10b981' }}>
            <div className="stat-icon" style={{ background: '#d1fae5' }}>👤</div>
            <p className="stat-label">Regular Users</p>
            <h2 className="stat-value">{stats.users}</h2>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>User Management</h3>
          {loading ? (
            <div className="loading">Loading users</div>
          ) : users.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-600)', padding: '2rem' }}>No users found.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=> (
                    <tr key={u.id}>
                      <td><strong>#{u.id}</strong></td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                      </td>
                      <td style={{ color: 'var(--gray-600)' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}`}>
                          {u.role === 'admin' ? '🔑 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {u.role !== 'admin' && (
                            <button 
                              onClick={()=>setRole(u.id,'admin')} 
                              className="btn btn-sm btn-secondary"
                              title="Promote to Admin"
                            >
                              ↑ Admin
                            </button>
                          )}
                          {u.role !== 'user' && (
                            <button 
                              onClick={()=>setRole(u.id,'user')} 
                              className="btn btn-sm btn-secondary"
                              title="Demote to User"
                            >
                              ↓ User
                            </button>
                          )}
                          <button 
                            onClick={()=>remove(u.id)} 
                            className="btn btn-sm btn-danger"
                            title="Delete User"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
