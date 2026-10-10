import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'

export default function DashboardLayout({ role, children }) {
  return (
    <div className="app-shell">
      <AnimatedBackground />
      <Sidebar role={role} />
      <div className="app-main">
        <Navbar />
        <div className="app-content">{children}</div>
      </div>
    </div>
  )
}
