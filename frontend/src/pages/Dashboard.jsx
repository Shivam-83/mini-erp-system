import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement)

export default function Dashboard(){
  const [data, setData] = useState({ revenue:0, invoiceCount:0, accountsReceivable:0, riskScore:0 })
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.get('/dashboard')
      .then(r=>{ setData(r.data); setLoading(false) })
      .catch(()=>setLoading(false))
  },[])

  const barChartData = {
    labels: ['Revenue', 'Invoices', 'A/R'],
    datasets: [{
      label: 'Financial Overview',
      data: [data.revenue, data.invoiceCount, data.accountsReceivable],
      backgroundColor: ['rgba(37, 99, 235, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)'],
      borderColor: ['rgb(37, 99, 235)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)'],
      borderWidth: 2,
      borderRadius: 8
    }]
  }

  const riskChartData = {
    labels: ['Low Risk', 'Risk Score', 'High Risk'],
    datasets: [{
      data: [Math.max(0, 100 - data.riskScore), data.riskScore, Math.max(0, data.riskScore - 50)],
      backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      borderWidth: 0
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 12, cornerRadius: 8 }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      x: { grid: { display: false } }
    }
  }

  const getRiskColor = (score) => {
    if (score > 75) return '#ef4444'
    if (score > 50) return '#f59e0b'
    if (score > 25) return '#3b82f6'
    return '#10b981'
  }

  if (loading) return (
    <div>
      <Navbar />
      <div className="container">
        <div className="loading">Loading dashboard data</div>
      </div>
    </div>
  )

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your construction projects and finances</p>
        </div>

        <div className="grid">
          <div className="stat-card" style={{ '--accent': '#2563eb', '--accent-light': '#dbeafe' }}>
            <div className="stat-icon" style={{ background: '#dbeafe' }}>💰</div>
            <p className="stat-label">Total Revenue</p>
            <h2 className="stat-value">${data.revenue?.toLocaleString() || 0}</h2>
            <p className="stat-change positive">↗ All time</p>
          </div>

          <div className="stat-card" style={{ '--accent': '#10b981', '--accent-light': '#d1fae5' }}>
            <div className="stat-icon" style={{ background: '#d1fae5' }}>📄</div>
            <p className="stat-label">Total Invoices</p>
            <h2 className="stat-value">{data.invoiceCount || 0}</h2>
            <p className="stat-change">Active invoices</p>
          </div>

          <div className="stat-card" style={{ '--accent': '#f59e0b', '--accent-light': '#fef3c7' }}>
            <div className="stat-icon" style={{ background: '#fef3c7' }}>🏦</div>
            <p className="stat-label">Accounts Receivable</p>
            <h2 className="stat-value">${data.accountsReceivable?.toLocaleString() || 0}</h2>
            <p className="stat-change">Outstanding balance</p>
          </div>

          <div className="stat-card" style={{ '--accent': getRiskColor(data.riskScore), '--accent-light': `${getRiskColor(data.riskScore)}20` }}>
            <div className="stat-icon" style={{ background: `${getRiskColor(data.riskScore)}20` }}>⚠️</div>
            <p className="stat-label">Risk Score</p>
            <h2 className="stat-value">
              {data.riskScore || 0}
              <span className="badge" style={{ background: `${getRiskColor(data.riskScore)}20`, color: getRiskColor(data.riskScore), fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                {data.riskScore > 75 ? 'Critical' : data.riskScore > 50 ? 'High' : data.riskScore > 25 ? 'Medium' : 'Low'}
              </span>
            </h2>
            <p className="stat-change">Project health indicator</p>
          </div>
        </div>

        <div className="grid-2">
          <div className="card chart-card">
            <h3>Financial Metrics</h3>
            <div style={{ height: '300px' }}>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          <div className="card chart-card">
            <h3>Risk Distribution</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut 
                data={riskChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, font: { size: 12 } } },
                    tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 12, cornerRadius: 8 }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
