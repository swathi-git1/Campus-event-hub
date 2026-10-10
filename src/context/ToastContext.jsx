import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    setToasts((prev) => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  const success = useCallback((msg, duration) => showToast(msg, 'success', duration), [showToast])
  const error = useCallback((msg, duration) => showToast(msg, 'error', duration), [showToast])
  const warning = useCallback((msg, duration) => showToast(msg, 'warning', duration), [showToast])
  const info = useCallback((msg, duration) => showToast(msg, 'info', duration), [showToast])

  // Attach to window for global API interceptors
  useEffect(() => {
    window.__showToast = showToast
    return () => {
      delete window.__showToast
    }
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast, removeToast, success, error, warning, info }}>
      {children}
      <div 
        className="toast-container" 
        role="region" 
        aria-live="polite" 
        aria-label="Notifications"
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          maxWidth: 420,
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type}`}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: 13.5,
              fontWeight: 500,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
              animation: 'toastSlideIn 0.25s ease forwards',
              background: 
                toast.type === 'error' ? 'var(--danger-soft)' :
                toast.type === 'warning' ? 'var(--amber-soft)' :
                toast.type === 'success' ? 'var(--green-soft)' : 'var(--card)',
              color: 
                toast.type === 'error' ? 'var(--danger)' :
                toast.type === 'warning' ? 'var(--amber)' :
                toast.type === 'success' ? 'var(--green)' : 'var(--ink)',
              border: 
                toast.type === 'error' ? '1px solid var(--danger)' :
                toast.type === 'warning' ? '1px solid var(--amber)' :
                toast.type === 'success' ? '1px solid var(--green)' : '1px solid var(--border)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>
                {toast.type === 'error' ? '⚠️' :
                 toast.type === 'warning' ? '⏳' :
                 toast.type === 'success' ? '✅' : 'ℹ️'}
              </span>
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 16,
                color: 'inherit',
                opacity: 0.6,
                padding: 0,
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  return ctx || {
    showToast: () => {},
    removeToast: () => {},
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  }
}
