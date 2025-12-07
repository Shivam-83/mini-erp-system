import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

function ProjectForm({ onCreated }){
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [progress, setProgress] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e){
    e.preventDefault();
    if (!name || !budget) return alert('Please fill required fields')
    setLoading(true)
    try{ 
      await api.post('/projects', { name, budget: parseFloat(budget), progress: parseFloat(progress) || 0, description })
      setName(''); setBudget(''); setProgress(''); setDescription('')
      onCreated()
      alert('✓ Project created successfully')
    }catch(e){ 
      alert('Failed to create project: ' + (e.response?.data?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <form className="form" onSubmit={submit}>
        <h3>Create New Project</h3>
        <div className="form-group">
          <label className="form-label">Project Name *</label>
          <input 
            type="text" 
            placeholder="e.g., Site A Construction" 
            value={name} 
            onChange={e=>setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Budget *</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={budget} 
            onChange={e=>setBudget(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Progress (%)</label>
          <input 
            type="number" 
            min="0"
            max="100"
            placeholder="0" 
            value={progress} 
            onChange={e=>setProgress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            placeholder="Project details..." 
            value={description} 
            onChange={e=>setDescription(e.target.value)}
            rows="3"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : '✓ Create Project'}
        </button>
      </form>
    </div>
  )
}

function getProgressColor(progress) {
  if (progress >= 80) return '#10b981'
  if (progress >= 50) return '#3b82f6'
  if (progress >= 25) return '#f59e0b'
  return '#ef4444'
}

function getBudgetHealth(budget, spent, progress) {
  const spentPct = budget > 0 ? (spent / budget) * 100 : 0
  if (spentPct > progress + 35) return { label: 'Critical', color: '#ef4444', class: 'badge-danger' }
  if (spentPct > progress + 20) return { label: 'High Risk', color: '#f59e0b', class: 'badge-warning' }
  if (spentPct > progress + 10) return { label: 'Watch', color: '#3b82f6', class: 'badge-info' }
  return { label: 'Healthy', color: '#10b981', class: 'badge-success' }
}

export default function Projects(){
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, totalBudget: 0, totalSpent: 0 })

  async function load(){ 
    try {
      const { data } = await api.get('/projects')
      const projs = data.projects || []
      setProjects(projs)
      
      // Calculate stats
      const totalBudget = projs.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0)
      const totalSpent = projs.reduce((sum, p) => sum + parseFloat(p.spent || 0), 0)
      setStats({
        total: projs.length,
        active: projs.filter(p => parseFloat(p.progress || 0) < 100).length,
        totalBudget,
        totalSpent
      })
    } catch(e) {
      console.error('Failed to load projects', e)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(()=>{ load() },[])

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Project Management</h1>
          <p className="page-subtitle">Track construction projects, budgets, and progress</p>
        </div>

        <div className="grid">
          <div className="stat-card" style={{ '--accent': '#2563eb' }}>
            <div className="stat-icon" style={{ background: '#dbeafe' }}>🏗️</div>
            <p className="stat-label">Total Projects</p>
            <h2 className="stat-value">{stats.total}</h2>
            <p className="stat-change">{stats.active} active</p>
          </div>
          <div className="stat-card" style={{ '--accent': '#10b981' }}>
            <div className="stat-icon" style={{ background: '#d1fae5' }}>💵</div>
            <p className="stat-label">Total Budget</p>
            <h2 className="stat-value">${stats.totalBudget.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          </div>
          <div className="stat-card" style={{ '--accent': '#f59e0b' }}>
            <div className="stat-icon" style={{ background: '#fef3c7' }}>📊</div>
            <p className="stat-label">Total Spent</p>
            <h2 className="stat-value">${stats.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
            <p className="stat-change">
              {stats.totalBudget > 0 ? `${((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}% utilized` : '-'}
            </p>
          </div>
          <div className="stat-card" style={{ '--accent': '#8b5cf6' }}>
            <div className="stat-icon" style={{ background: '#ede9fe' }}>🎯</div>
            <p className="stat-label">Avg Progress</p>
            <h2 className="stat-value">
              {stats.total > 0 ? Math.round(projects.reduce((sum, p) => sum + parseFloat(p.progress || 0), 0) / stats.total) : 0}%
            </h2>
          </div>
        </div>

        <div className="grid-2">
          <ProjectForm onCreated={load} />
          
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Active Projects</h3>
            {loading ? (
              <div className="loading">Loading projects</div>
            ) : projects.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--gray-600)', padding: '2rem' }}>No projects yet. Create one to get started.</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Budget</th>
                      <th>Spent</th>
                      <th>Progress</th>
                      <th>Health</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p=> {
                      const health = getBudgetHealth(parseFloat(p.budget || 0), parseFloat(p.spent || 0), parseFloat(p.progress || 0))
                      return (
                        <tr key={p.id}>
                          <td><strong>#{p.id}</strong></td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            {p.description && <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{p.description}</div>}
                          </td>
                          <td><strong>${parseFloat(p.budget).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></td>
                          <td>${parseFloat(p.spent || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ flex: 1, height: '8px', background: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${p.progress}%`, background: getProgressColor(p.progress), transition: 'width 0.3s' }}></div>
                              </div>
                              <span style={{ fontWeight: 600, minWidth: '45px' }}>{p.progress}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${health.class}`}>
                              {health.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
