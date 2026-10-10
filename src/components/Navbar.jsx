import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user } = useAuth()
  const { language, setLanguage, t } = useI18n()

  return (
    <div className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="search-box" style={{ maxWidth: 360, width: 320 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--ink-soft)' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input placeholder="Search events, clubs, rosters..." />
          <span style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: 10, 
            background: 'rgba(255, 255, 255, 0.06)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1px 5px',
            borderRadius: 4,
            color: 'var(--ink-soft)'
          }}>
            ⌘K
          </span>
        </div>

        <div style={{ display: 'none', md: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
          <span>AP-SOUTH-1</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Language selector"
          style={{
            height: 32,
            padding: '2px 8px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface-2)',
            color: 'var(--ink)',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer'
          }}
        >
          <option value="en">🇺🇸 EN</option>
          <option value="ta">🇮🇳 தமிழ்</option>
          <option value="hi">🇮🇳 हिन्दी</option>
        </select>

        <Link 
          to="/links" 
          title="Multi-Channel Alerts (WhatsApp • SMS • Email)"
          style={{ 
            fontSize: 12, 
            fontFamily: 'var(--font-mono)', 
            color: 'var(--ink-soft)', 
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface-2)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          📲 Alerts (WhatsApp/SMS)
        </Link>

        <Link 
          to="/settings" 
          title="Settings & Appearance"
          style={{ 
            fontSize: 12, 
            fontFamily: 'var(--font-mono)', 
            color: 'var(--ink-soft)', 
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface-2)',
            textDecoration: 'none'
          }}
        >
          ⚙️ Settings
        </Link>

        <Link 
          to="/" 
          style={{ 
            fontSize: 12, 
            fontFamily: 'var(--font-mono)', 
            color: 'var(--ink-soft)', 
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface-2)',
            textDecoration: 'none'
          }}
        >
          ← {t('nav.publicPortal', 'Public')}
        </Link>
        <ThemeToggle />
        <NotificationBell />
        <div className="navbar-user">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green, #4D7C47)' }} />
          <b>{user?.name || 'Authorized User'}</b>
          <span style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: 10, 
            textTransform: 'uppercase', 
            color: 'var(--orange)', 
            background: 'var(--orange-soft)',
            border: '1px solid var(--border)',
            padding: '1px 5px',
            borderRadius: 3
          }}>
            {user?.role?.replace('_', ' ') || 'GUEST'}
          </span>
        </div>
      </div>
    </div>
  )
}
