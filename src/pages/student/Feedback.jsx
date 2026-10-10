import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'

export default function Feedback() {
  const { visibleEvents: events, registrations } = useData()
  const { user } = useAuth()

  const studentEmail = user?.email || 'student@college.edu'
  const myRegs = registrations.filter(r =>
    String(r.email || '').trim().toLowerCase() === studentEmail.toLowerCase()
  )

  const [selectedEventId, setSelectedEventId] = useState(() => myRegs[0]?.eventId || events[0]?.id || 1)
  const [rating, setRating] = useState(5)
  const [mentorshipRating, setMentorshipRating] = useState(5)
  const [venueRating, setVenueRating] = useState(5)
  const [tags, setTags] = useState(['Great Mentors', 'Hands-on Learning'])
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const activeEvent = events.find(e => e.id === Number(selectedEventId)) || events[0]

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const ratingLabels = {
    1: 'Needs Significant Improvement',
    2: 'Below Expectations',
    3: 'Satisfactory / Good',
    4: 'Very Good & Well Organized',
    5: 'Outstanding / Top Tier Experience'
  }

  return (
    <DashboardLayout role="student">
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>University Event Feedback & Review</h1>
            <span className="badge tag-indigo">Student Portal</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Share your authentic experience, rate student coordinators and faculty mentorship, and help improve campus activities.
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '36px 20px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--green-soft)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 16px', fontWeight: 700 }}>
                ✓
              </div>
              <h2 style={{ fontSize: 22, marginBottom: 6 }}>Feedback Submitted Successfully!</h2>
              <p className="muted" style={{ fontSize: 13.5, maxWidth: 440, margin: '0 auto 20px' }}>
                Thank you, <b>{user?.name || 'Student'}</b>. Your review for <b>{activeEvent?.title}</b> ({activeEvent?.club} Chapter) has been recorded in the faculty evaluation report.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSubmitted(false)
                  setComment('')
                }}
              >
                Submit Review for Another Event
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Event Selector */}
              <div className="field">
                <label>Select Attended Event *</label>
                <select
                  value={selectedEventId}
                  onChange={e => setSelectedEventId(Number(e.target.value))}
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} — {ev.club} Chapter ({ev.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Quick Dossier */}
              {activeEvent && (
                <div style={{ padding: '12px 16px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{activeEvent.title}</div>
                    <div className="muted" style={{ fontSize: 12 }}>🏛️ {activeEvent.club} Chapter · 📍 {activeEvent.venue}</div>
                  </div>
                  <span className="badge tag-purple" style={{ fontSize: 11 }}>{activeEvent.tag || 'Technical'} Event</span>
                </div>
              )}

              {/* Overall Star Rating */}
              <div className="field" style={{ marginBottom: 20 }}>
                <label>Overall Experience Rating *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                  <div style={{ fontSize: 28, letterSpacing: 4, cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <span
                        key={n}
                        onClick={() => setRating(n)}
                        style={{
                          color: n <= rating ? 'var(--amber)' : 'var(--input-border)',
                          transition: 'color 0.15s ease',
                          display: 'inline-block',
                          transform: n <= rating ? 'scale(1.08)' : 'scale(1)'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)' }}>
                    {rating} / 5 · {ratingLabels[rating]}
                  </span>
                </div>
              </div>

              {/* Secondary Ratings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div className="field">
                  <label>Faculty & Mentorship Guidance</label>
                  <select value={mentorshipRating} onChange={e => setMentorshipRating(Number(e.target.value))}>
                    <option value={5}>⭐⭐⭐⭐⭐ Excellent Mentorship</option>
                    <option value={4}>⭐⭐⭐⭐ Very Good Guidance</option>
                    <option value={3}>⭐⭐⭐ Average Support</option>
                    <option value={2}>⭐⭐ Needs More Mentors</option>
                    <option value={1}>⭐ Poor Mentorship</option>
                  </select>
                </div>

                <div className="field">
                  <label>Venue, Audio & Logistics</label>
                  <select value={venueRating} onChange={e => setVenueRating(Number(e.target.value))}>
                    <option value={5}>⭐⭐⭐⭐⭐ Flawless Logistics</option>
                    <option value={4}>⭐⭐⭐⭐ Well Organized</option>
                    <option value={3}>⭐⭐⭐ Satisfactory Hall</option>
                    <option value={2}>⭐⭐ Seating / Audio Issues</option>
                    <option value={1}>⭐ Poor Facilities</option>
                  </select>
                </div>
              </div>

              {/* Recommendation Tags */}
              <div className="field" style={{ marginBottom: 20 }}>
                <label>Highlight Highlights & Strengths (Click to select)</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {[
                    'Great Mentors',
                    'Hands-on Learning',
                    'Clear Explanations',
                    'Good Refreshments',
                    'On-Time Schedule',
                    'Valuable Certificate',
                    'Fun Networking'
                  ].map(tag => {
                    const active = tags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: active ? '1.5px solid var(--indigo)' : '1px solid var(--border-strong)',
                          background: active ? 'var(--indigo-soft)' : 'var(--card)',
                          color: active ? 'var(--indigo)' : 'var(--ink)'
                        }}
                      >
                        {active ? '✓ ' : '+ '}{tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Detailed Comments */}
              <div className="field" style={{ marginBottom: 24 }}>
                <label>Detailed Feedback & Suggestions for Organizing Team</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share what you liked most, key takeaways, and what the club coordinators can improve in future editions..."
                  style={{ lineHeight: 1.6 }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ padding: '12px 20px', fontSize: 14 }}>
                Submit Official Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
