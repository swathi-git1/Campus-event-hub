import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ dark = false }) {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      className={'theme-toggle' + (dark ? ' theme-toggle-dark' : '')}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
