import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

function InvoiceForm({ onCreated }){
  const [projectId, setProjectId] = useState('')
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e){
    e.preventDefault();
    if (!projectId || !amount) return alert('Please fill required fields')
    setLoading(true)
    try{
      await api.post('/invoices', { project_id: projectId, amount: parseFloat(amount), description: desc })
      setProjectId(''); setAmount(''); setDesc('');
      onCreated()
      alert('✓ Invoice created successfully')
    }catch(e){
      alert('Failed to create invoice: ' + (e.response?.data?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <form className="form" onSubmit={submit}>
        <h3>Create New Invoice</h3>
        <div className="form-group">
          <label className="form-label">Project ID *</label>
          <input 
            type="number" 
            placeholder="Enter project ID" 
            value={projectId} 
            onChange={e=>setProjectId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Amount *</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={amount} 
            onChange={e=>setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            placeholder="Invoice description..." 
            value={desc} 
            onChange={e=>setDesc(e.target.value)}
            rows="3"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : '✓ Create Invoice'}
        </button>
      </form>
    </div>
  )
}

function getStatusBadge(status) {
  const statusMap = {
    'paid': 'badge-success',
    'pending': 'badge-warning',
    'overdue': 'badge-danger',
    'issued': 'badge-info'
  }
  return statusMap[status?.toLowerCase()] || 'badge-info'
}

export default function Finance(){
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0 })

  async function load(){
    try {
      const { data } = await api.get('/invoices')
      const invs = data.invoices || []
      setInvoices(invs)
      
      // Calculate stats
      const total = invs.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0)
      const paid = invs.filter(i => i.status === 'paid').reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0)
      const pending = total - paid
      setStats({ total, paid, pending })
    } catch(e) {
      console.error('Failed to load invoices', e)
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
          <h1 className="page-title">Finance Management</h1>
          <p className="page-subtitle">Manage invoices and track accounts receivable</p>
        </div>

        <div className="grid">
          <div className="stat-card" style={{ '--accent': '#2563eb' }}>
            <div className="stat-icon" style={{ background: '#dbeafe' }}>💳</div>
            <p className="stat-label">Total Invoiced</p>
            <h2 className="stat-value">${stats.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          </div>
          <div className="stat-card" style={{ '--accent': '#10b981' }}>
            <div className="stat-icon" style={{ background: '#d1fae5' }}>✓</div>
            <p className="stat-label">Paid</p>
            <h2 className="stat-value">${stats.paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          </div>
          <div className="stat-card" style={{ '--accent': '#f59e0b' }}>
            <div className="stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
            <p className="stat-label">Pending</p>
            <h2 className="stat-value">${stats.pending.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          </div>
        </div>

        <div className="grid-2">
          <InvoiceForm onCreated={load} />
          
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Invoice History</h3>
            {loading ? (
              <div className="loading">Loading invoices</div>
            ) : invoices.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--gray-600)', padding: '2rem' }}>No invoices yet. Create one to get started.</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Project</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(inv=> (
                      <tr key={inv.id}>
                        <td><strong>#{inv.id}</strong></td>
                        <td>Project {inv.project_id}</td>
                        <td><strong>${parseFloat(inv.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></td>
                        <td>
                          <span className={`badge ${getStatusBadge(inv.status)}`}>
                            {inv.status || 'pending'}
                          </span>
                        </td>
                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {inv.description || '-'}
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
    </div>
  )
}
