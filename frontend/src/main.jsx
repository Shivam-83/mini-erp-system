import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Finance from './pages/Finance'
import Projects from './pages/Projects'
import Admin from './pages/Admin'
import Customers from './pages/Customers'
import Vendors from './pages/Vendors'
import GeneralLedger from './pages/GeneralLedger'
import FinancialStatements from './pages/FinancialStatements'
import './styles.css'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/finance" element={<PrivateRoute><Finance/></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Projects/></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin/></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><Customers/></PrivateRoute>} />
        <Route path="/vendors" element={<PrivateRoute><Vendors/></PrivateRoute>} />
        <Route path="/general-ledger" element={<PrivateRoute><GeneralLedger/></PrivateRoute>} />
        <Route path="/financial-statements" element={<PrivateRoute><FinancialStatements/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
