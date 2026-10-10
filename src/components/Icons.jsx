import React from 'react'

const base = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const MailIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 6.5 8 6 8-6" />
  </svg>
)

export const LockIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3" />
  </svg>
)

export const EyeIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
)

export const EyeOffIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.7A9.9 9.9 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a15.6 15.6 0 0 1-3.4 4.2M6.6 6.6C4 8.3 2 12 2 12s3.6 6.5 10 6.5a9.6 9.6 0 0 0 3.4-.6" />
    <path d="M9.9 10a2.8 2.8 0 0 0 3.95 3.95" />
  </svg>
)

export const ShieldIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.5 5 6.2v5.4c0 4.6 3 7.6 7 9.4 4-1.8 7-4.8 7-9.4V6.2L12 3.5Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const UserIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="8.2" r="3.6" />
    <path d="M4.5 20c1.3-3.6 4.2-5.5 7.5-5.5s6.2 1.9 7.5 5.5" />
  </svg>
)

export const BuildingIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="4" y="4" width="10" height="16" rx="1.2" />
    <path d="M14 9h6v11h-6" />
    <path d="M7 8h1M10 8h1M7 11h1M10 11h1M7 14h1M10 14h1" />
  </svg>
)

export const UsersIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.8 19c1.1-3.2 3.5-4.8 6.2-4.8s5.1 1.6 6.2 4.8" />
    <path d="M15.5 5a3.2 3.2 0 0 1 0 6.2" />
    <path d="M17.8 14.6c2.1.5 3.5 1.9 4.4 4.4" />
  </svg>
)
