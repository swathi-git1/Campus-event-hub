import React from 'react'
import Logo from './Logo'
import { events, clubs } from '../data/mockData'

const COPY = {
  student: {
    eyebrow: 'STUDENT SCHOLAR PORTAL',
    heading: 'Manage campus events with confidence.',
    body: 'The Student Scholar portal provides 1-tap event registrations and personal participation records.',
  },
  instructor: {
    eyebrow: 'FACULTY ADVISOR PORTAL',
    heading: 'Manage campus events with confidence.',
    body: 'The Faculty Advisor portal allows chapter leads to manage rosters, track attendance, and publish achievements.',
  },
  faculty_od: {
    eyebrow: 'OD IN-CHARGE PORTAL',
    heading: 'Manage campus events with confidence.',
    body: 'The OD In-Charge portal is used to review event permissions, verify student participation, and manage official passes.',
  },
  admin: {
    eyebrow: 'COLLEGE ADMINISTRATION SYSTEM',
    heading: 'Manage campus events with confidence.',
    body: 'The Platform Administrator console enables institution-wide event governance and NAAC compliance.',
  }
}

export default function AuthVisual({ role = 'student' }) {
  const copy = COPY[role] || COPY.student
  const totalRegistered = events.reduce((sum, e) => sum + (e.registered || 0), 0)

  return (
    <aside className="portal-left">
      <div className="portal-left-top">
        <div className="portal-brand-wrap">
          <Logo size={24} textSize={15} dark />
        </div>
      </div>

      <div className="portal-left-mid">
        <div className="portal-context-eyebrow">
          <span className="portal-eyebrow-sq" />
          {copy.eyebrow}
        </div>

        <h1 className="portal-context-headline">
          {copy.heading}
        </h1>

        <p className="portal-context-body">
          {copy.body}
        </p>

        {/* ONE Clean Visual Module: Aligned 3-Metric Grid */}
        <div className="portal-stat-module">
          <div className="portal-stat-module-header">
            <span className="portal-stat-module-title">INSTITUTIONAL METRICS</span>
            <span style={{ fontSize: 10, color: '#D49B6A', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>● LIVE ERP SYNC</span>
          </div>

          <div className="portal-stat-grid">
            <div className="portal-stat-item">
              <span className="portal-stat-val">{clubs.length}+</span>
              <span className="portal-stat-label">Active Chapters</span>
            </div>
            <div className="portal-stat-item">
              <span className="portal-stat-val">{events.length}</span>
              <span className="portal-stat-label">Live Events</span>
            </div>
            <div className="portal-stat-item">
              <span className="portal-stat-val">{totalRegistered}+</span>
              <span className="portal-stat-label">Verified Attendees</span>
            </div>
          </div>
        </div>
      </div>

      <div className="portal-left-bottom">
        <span className="portal-status-dot" />
        <span>Anna University Affiliated · FERPA &amp; NAAC A++ Aligned</span>
      </div>
    </aside>
  )
}
