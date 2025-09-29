import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <div>
      {/* Navbar */}
      <nav>
        <div className="nav-left">
          <Link to="/">Home</Link> |{" "}
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
