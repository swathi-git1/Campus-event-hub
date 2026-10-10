import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="app-content" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Page not found</h1>
      <Link to="/" className="btn btn-primary">← Back to home</Link>
    </div>
  )
}
