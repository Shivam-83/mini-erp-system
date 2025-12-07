import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

function VendorForm({ onCreated, vendor, onCancel }) {
  const [formData, setFormData] = useState(vendor || {
    name: '', email: '', phone: '', address: '', city: '', country: '', tax_id: '', payment_terms: ''
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
      if (vendor) {
        await api.put(`/vendors/${vendor.id}`, formData)
        alert('✓ Vendor updated')
      } else {
        await api.post('/vendors', formData)
        alert('✓ Vendor created')
      }
      setFormData({ name: '', email: '', phone: '', address: '', city: '', country: '', tax_id: '', payment_terms: '' })
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
        <h3>{vendor ? 'Edit Vendor' : 'Add New Vendor'}</h3>
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
            <label className="form-label">Payment Terms</label>
            <input name="payment_terms" placeholder="e.g., Net 30" value={formData.payment_terms} onChange={handleChange} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (vendor ? 'Update' : 'Create')}
          </button>
          {vendor && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  )
}

export default function Vendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    try {
      const { data } = await api.get('/vendors')
      setVendors(data.vendors || [])
    } catch(e) {
      console.error('Failed to load vendors', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function deleteVendor(id) {
    if (!confirm('Delete this vendor?')) return
    try {
      await api.delete(`/vendors/${id}`)
      alert('✓ Vendor deleted')
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
    total: vendors.length,
    active: vendors.filter(v => v.status === 'active').length,
    totalBalance: vendors.reduce((sum, v) => sum + parseFloat(v.balance || 0), 0)
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Vendor Management</h1>
          <p className="page-subtitle">Manage vendor accounts and payables</p>
        </div>

        <div className="grid">
          <div className="stat-card" style={{ '--accent': '#8b5cf6' }}>
            <div className="stat-icon" style={{ background: '#ede9fe' }}>🏭</div>
            <p className="stat-label">Total Vendors</p>
            <h2 className="stat-value">{stats.total}</h2>
          </div>
          <div className="stat-card" style={{ '--accent': '#10b981' }}>
            <div className="stat-icon" style={{ background: '#d1fae5' }}>✓</div>
            <p className="stat-label">Active</p>
            <h2 className="stat-value">{stats.active}</h2>
          </div>
          <div className="stat-card" style={{ '--accent': '#ef4444' }}>
            <div className="stat-icon" style={{ background: '#fee2e2' }}>💳</div>
            <p className="stat-label">Total Payable</p>
            <h2 className="stat-value">${stats.totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          </div>
        </div>

        {(showForm || editing) ? (
          <VendorForm 
            vendor={editing} 
            onCreated={handleCreated} 
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Vendor
            </button>
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Vendor List</h3>
          {loading ? (
            <div className="loading">Loading vendors</div>
          ) : vendors.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-600)', padding: '2rem' }}>
              No vendors yet. Add one to get started.
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
                    <th>Payment Terms</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id}>
                      <td><strong>{v.name}</strong></td>
                      <td>{v.email || '-'}</td>
                      <td>{v.phone || '-'}</td>
                      <td>{v.city || '-'}</td>
                      <td>{v.payment_terms || '-'}</td>
                      <td>${parseFloat(v.balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td>
                        <span className={`badge ${v.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {v.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditing(v)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteVendor(v.id)}>
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
