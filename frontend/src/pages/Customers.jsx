import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

function CustomerForm({ onCreated, customer, onCancel }) {
  const [formData, setFormData] = useState(customer || {
    name: '', email: '', phone: '', address: '', city: '', country: '', tax_id: '', credit_limit: ''
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    if (!formData.name) return alert('Name is required')
    setLoading(true)
    try {
      if (customer) {
        await api.put(`/customers/${customer.id}`, formData)
        alert('✓ Customer updated')
      } else {
        await api.post('/customers', formData)
        alert('✓ Customer created')
      }
      setFormData({ name: '', email: '', phone: '', address: '', city: '', country: '', tax_id: '', credit_limit: '' })
      onCreated()
    } catch(e) {
      alert('Failed: ' + (e.response?.data?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <form className="form" onSubmit={submit}>
        <h3>{customer ? 'Edit Customer' : 'Add New Customer'}</h3>
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <input name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">City</label>
            <input name="city" value={formData.city} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input name="country" value={formData.country} onChange={handleChange} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Tax ID</label>
            <input name="tax_id" value={formData.tax_id} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Credit Limit</label>
            <input type="number" step="0.01" name="credit_limit" value={formData.credit_limit} onChange={handleChange} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (customer ? 'Update' : 'Create')}
          </button>
          {customer && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  )
}

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    try {
      const { data } = await api.get('/customers')
      setCustomers(data.customers || [])
    } catch(e) {
      console.error('Failed to load customers', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function deleteCustomer(id) {
    if (!confirm('Delete this customer?')) return
    try {
      await api.delete(`/customers/${id}`)
      alert('✓ Customer deleted')
      load()
    } catch(e) {
      alert('Delete failed')
    }
  }

  function handleCreated() {
    setShowForm(false)
    setEditing(null)
    load()
  }

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    totalBalance: customers.reduce((sum, c) => sum + parseFloat(c.balance || 0), 0)
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">Manage customer accounts and receivables</p>
        </div>

        <div className="grid">
          <div className="stat-card" style={{ '--accent': '#2563eb' }}>
            <div className="stat-icon" style={{ background: '#dbeafe' }}>👥</div>
            <p className="stat-label">Total Customers</p>
            <h2 className="stat-value">{stats.total}</h2>
          </div>
          <div className="stat-card" style={{ '--accent': '#10b981' }}>
            <div className="stat-icon" style={{ background: '#d1fae5' }}>✓</div>
            <p className="stat-label">Active</p>
            <h2 className="stat-value">{stats.active}</h2>
          </div>
          <div className="stat-card" style={{ '--accent': '#f59e0b' }}>
            <div className="stat-icon" style={{ background: '#fef3c7' }}>💰</div>
            <p className="stat-label">Total Balance</p>
            <h2 className="stat-value">${stats.totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          </div>
        </div>

        {(showForm || editing) ? (
          <CustomerForm 
            customer={editing} 
            onCreated={handleCreated} 
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Customer
            </button>
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Customer List</h3>
          {loading ? (
            <div className="loading">Loading customers</div>
          ) : customers.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-600)', padding: '2rem' }}>
              No customers yet. Add one to get started.
            </p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email || '-'}</td>
                      <td>{c.phone || '-'}</td>
                      <td>{c.city || '-'}</td>
                      <td>${parseFloat(c.balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td>
                        <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {c.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditing(c)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteCustomer(c.id)}>
                            Delete
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
