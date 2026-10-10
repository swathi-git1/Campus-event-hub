import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './context/ToastContext'
import { I18nProvider } from './context/I18nContext'
import './index.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash caught by ErrorBoundary:", error, errorInfo)
  }

  handleReset = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          background: '#f8fafc',
          color: '#0f172a',
          padding: 24
        }}>
          <div style={{
            maxWidth: 500,
            background: '#ffffff',
            padding: 32,
            borderRadius: 16,
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
            <h2 style={{ fontSize: 22, margin: '0 0 8px' }}>Something went wrong</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 20px', lineHeight: 1.5 }}>
              A temporary rendering issue occurred. Click the button below to reset the cache and restore the interface.
            </p>
            <div style={{
              background: '#f1f5f9',
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
              fontFamily: 'monospace',
              color: '#dc2626',
              textAlign: 'left',
              marginBottom: 20,
              overflowX: 'auto'
            }}>
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                background: '#4338ca',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset Cache & Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <ThemeProvider>
            <I18nProvider>
              <DataProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </DataProvider>
            </I18nProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
