import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  function logout(){
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return (
    <div className="navbar">
      <div className="brand">Mini ERP</div>
      <div className="navlinks">
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/finance">Finance</Link>
        <Link to="/general-ledger">General Ledger</Link>
        <Link to="/financial-statements">Statements</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/vendors">Vendors</Link>
        <Link to="/admin">Admin</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
