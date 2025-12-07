import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function GeneralLedger() {
  const [accounts, setAccounts] = useState([])
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('accounts') // 'accounts' or 'entries'
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [entryLines, setEntryLines] = useState([{ account_id: '', debit: '', credit: '', description: '' }])
  const [entryData, setEntryData] = useState({ entry_date: new Date().toISOString().split('T')[0], description: '', reference: '' })

  async function loadAccounts() {
    try {
      const { data } = await api.get('/journal/accounts')
      setAccounts(data.accounts || [])
    } catch(e) {
      console.error('Failed to load accounts', e)
    } finally {
      setLoading(false)
    }
  }

  async function loadEntries() {
    try {
      const { data } = await api.get('/journal/entries')
      setEntries(data.entries || [])
    } catch(e) {
      console.error('Failed to load entries', e)
    }
  }

  useEffect(() => {
    loadAccounts()
    loadEntries()
  }, [])

  function addLine() {
    setEntryLines([...entryLines, { account_id: '', debit: '', credit: '', description: '' }])
  }

  function updateLine(index, field, value) {
    const updated = [...entryLines]
    updated[index][field] = value
    setEntryLines(updated)
  }

  async function createEntry(e) {
    e.preventDefault()
    const totalDebit = entryLines.reduce((sum, l) => sum + parseFloat(l.debit || 0), 0)
    const totalCredit = entryLines.reduce((sum, l) => sum + parseFloat(l.credit || 0), 0)
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return alert('Debits must equal Credits')
    }

    try {
      await api.post('/journal/entries', { ...entryData, lines: entryLines })
      alert('✓ Journal entry created')
      setShowEntryForm(false)
      setEntryLines([{ account_id: '', debit: '', credit: '', description: '' }])
      loadEntries()
    } catch(e) {
      alert('Failed to create entry')
    }
  }

  const accountsByType = accounts.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = []
    acc[account.type].push(account)
    return acc
  }, {})

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">General Ledger</h1>
          <p className="page-subtitle">Chart of accounts and journal entries</p>
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className={`btn ${view === 'accounts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('accounts')}
          >
            Chart of Accounts
          </button>
          <button 
            className={`btn ${view === 'entries' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('entries')}
          >
            Journal Entries
          </button>
          {view === 'entries' && (
            <button className="btn btn-success" onClick={() => setShowEntryForm(!showEntryForm)}>
              {showEntryForm ? 'Cancel' : '+ New Entry'}
            </button>
          )}
        </div>

        {showEntryForm && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <form className="form" onSubmit={createEntry}>
              <h3>Create Journal Entry</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Entry Date</label>
                  <input type="date" value={entryData.entry_date} onChange={e => setEntryData({...entryData, entry_date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input value={entryData.description} onChange={e => setEntryData({...entryData, description: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Reference</label>
                  <input value={entryData.reference} onChange={e => setEntryData({...entryData, reference: e.target.value})} />
                </div>
              </div>

              <h4>Entry Lines</h4>
              {entryLines.map((line, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'end' }}>
                  <select value={line.account_id} onChange={e => updateLine(i, 'account_id', e.target.value)} required>
                    <option value="">Select Account</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                  </select>
                  <input type="number" step="0.01" placeholder="Debit" value={line.debit} onChange={e => updateLine(i, 'debit', e.target.value)} />
                  <input type="number" step="0.01" placeholder="Credit" value={line.credit} onChange={e => updateLine(i, 'credit', e.target.value)} />
                  <input placeholder="Description" value={line.description} onChange={e => updateLine(i, 'description', e.target.value)} />
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" onClick={addLine} style={{ marginBottom: '1rem' }}>+ Add Line</button>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Debit: </strong>${entryLines.reduce((sum, l) => sum + parseFloat(l.debit || 0), 0).toFixed(2)} | 
                  <strong> Credit: </strong>${entryLines.reduce((sum, l) => sum + parseFloat(l.credit || 0), 0).toFixed(2)}
                </div>
                <button type="submit" className="btn btn-primary">Create Entry</button>
              </div>
            </form>
          </div>
        )}

        {view === 'accounts' && (
          <div>
            {Object.keys(accountsByType).map(type => (
              <div key={type} className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ textTransform: 'capitalize', marginBottom: '1rem' }}>{type} Accounts</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr><th>Code</th><th>Name</th><th>Category</th><th>Balance</th></tr>
                    </thead>
                    <tbody>
                      {accountsByType[type].map(a => (
                        <tr key={a.id}>
                          <td><strong>{a.code}</strong></td>
                          <td>{a.name}</td>
                          <td>{a.category}</td>
                          <td><strong>${parseFloat(a.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'entries' && (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Journal Entries</h3>
            {entries.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-600)' }}>No entries yet</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr><th>Entry #</th><th>Date</th><th>Description</th><th>Status</th><th>Created By</th></tr>
                  </thead>
                  <tbody>
                    {entries.map(e => (
                      <tr key={e.id}>
                        <td><strong>{e.entry_number}</strong></td>
                        <td>{new Date(e.entry_date).toLocaleDateString()}</td>
                        <td>{e.description}</td>
                        <td><span className={`badge badge-${e.status === 'approved' ? 'success' : 'warning'}`}>{e.status}</span></td>
                        <td>{e.created_by_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
