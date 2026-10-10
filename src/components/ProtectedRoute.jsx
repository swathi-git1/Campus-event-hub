import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth()

  if (!user) {
    const targetRole = Array.isArray(role) ? role[0] : (role || 'student')
    return <Navigate to={`/login/${targetRole}`} replace />
  }

  const isAllowed = Array.isArray(role)
    ? role.includes(user.role)
    : (!role || user.role === role)

  if (!isAllowed) {
    if (user.role === 'faculty_od') {
      return <Navigate to="/od-incharge/dashboard" replace />
    }
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }
  return children
}

