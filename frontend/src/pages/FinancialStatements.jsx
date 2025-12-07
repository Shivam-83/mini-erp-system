import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function FinancialStatements() {
  const [balanceSheet, setBalanceSheet] = useState(null)
  const [profitLoss, setProfitLoss] = useState(null)
  const [cashFlow, setCashFlow] = useState(null)
  const [view, setView] = useState('balance-sheet')
  const [loading, setLoading] = useState(true)

  async function loadStatements() {
    setLoading(true)
    try {
      const [bs, pl, cf] = await Promise.all([
        api.get('/financials/balance-sheet'),
        api.get('/financials/profit-loss'),
        api.get('/financials/cash-flow')
      ])
      console.log('Cash Flow Data:', cf.data)
      console.log('Cash Flow Object:', cf.data.cash_flow)
      setBalanceSheet(bs.data.balance_sheet)
      setProfitLoss(pl.data.profit_loss)
      setCashFlow(cf.data.cash_flow)
    } catch(e) {
      console.error('Failed to load statements', e)
      alert('Error loading financial statements: ' + (e.response?.data?.message || e.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStatements() }, [])

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Financial Statements</h1>
          <p className="page-subtitle">Balance Sheet, P&L, and Cash Flow reports</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button className={`btn ${view === 'balance-sheet' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('balance-sheet')}>
            Balance Sheet
          </button>
          <button className={`btn ${view === 'profit-loss' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('profit-loss')}>
            Profit & Loss
          </button>
          <button className={`btn ${view === 'cash-flow' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('cash-flow')}>
            Cash Flow
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading financial statements</div>
        ) : (
          <>
            {view === 'balance-sheet' && balanceSheet && (
              <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2>Balance Sheet</h2>
                  <p style={{ color: 'var(--gray-600)' }}>As of {balanceSheet.date}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h3 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Assets</h3>
                    {balanceSheet.assets.accounts.map(a => (
                      <div key={a.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                        <span>{a.name}</span>
                        <strong>${parseFloat(a.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', background: 'var(--gray-50)', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      <span>Total Assets</span>
                      <span>${balanceSheet.assets.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ borderBottom: '2px solid var(--danger)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Liabilities</h3>
                    {balanceSheet.liabilities.accounts.map(a => (
                      <div key={a.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                        <span>{a.name}</span>
                        <strong>${parseFloat(a.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', background: 'var(--gray-50)', marginTop: '0.5rem', fontWeight: 'bold' }}>
                      <span>Total Liabilities</span>
                      <span>${balanceSheet.liabilities.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>

                    <h3 style={{ borderBottom: '2px solid var(--secondary)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem' }}>Equity</h3>
                    {balanceSheet.equity.accounts.map(a => (
                      <div key={a.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                        <span>{a.name}</span>
                        <strong>${parseFloat(a.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', background: 'var(--gray-50)', marginTop: '0.5rem', fontWeight: 'bold' }}>
                      <span>Total Equity</span>
                      <span>${balanceSheet.equity.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'profit-loss' && profitLoss && (
              <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2>Profit & Loss Statement</h2>
                  <p style={{ color: 'var(--gray-600)' }}>Period: {profitLoss.period.start || 'YTD'} to {profitLoss.period.end || 'Current'}</p>
                </div>

                <h3 style={{ borderBottom: '2px solid var(--secondary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Revenue</h3>
                {profitLoss.revenue.accounts.map(a => (
                  <div key={a.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                    <span>{a.name}</span>
                    <strong>${parseFloat(a.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', background: '#d1fae5', marginTop: '0.5rem', fontWeight: 'bold' }}>
                  <span>Total Revenue</span>
                  <span>${profitLoss.revenue.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>

                <h3 style={{ borderBottom: '2px solid var(--danger)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem' }}>Expenses</h3>
                {profitLoss.expenses.accounts.map(a => (
                  <div key={a.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                    <span>{a.name}</span>
                    <strong>${parseFloat(a.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', background: '#fee2e2', marginTop: '0.5rem', fontWeight: 'bold' }}>
                  <span>Total Expenses</span>
                  <span>${profitLoss.expenses.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: profitLoss.net_income >= 0 ? '#d1fae5' : '#fee2e2', marginTop: '2rem', fontSize: '1.25rem', fontWeight: 'bold', borderRadius: '8px' }}>
                  <span>Net Income</span>
                  <span>${profitLoss.net_income.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            )}

            {view === 'cash-flow' && (
              cashFlow ? (
                <div className="card">
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2>Cash Flow Statement</h2>
                    <p style={{ color: 'var(--gray-600)' }}>{cashFlow.period || 'Current Period'}</p>
                  </div>

                  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '2px solid var(--gray-300)' }}>
                      <span>Opening Balance</span>
                      <strong>${(cashFlow.opening_balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                      <span style={{ color: 'var(--secondary)' }}>Cash Inflow</span>
                      <strong style={{ color: 'var(--secondary)' }}>+${(cashFlow.cash_inflow || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '2px solid var(--gray-300)' }}>
                      <span style={{ color: 'var(--danger)' }}>Cash Outflow</span>
                      <strong style={{ color: 'var(--danger)' }}>-${(cashFlow.cash_outflow || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: 'var(--primary)', color: '#fff', marginTop: '1rem', fontSize: '1.25rem', fontWeight: 'bold', borderRadius: '8px' }}>
                      <span>Closing Balance</span>
                      <span>${(cashFlow.closing_balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-600)' }}>
                    Cash Flow data is not available. Please ensure the database has cash account (code 1000) configured.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}
