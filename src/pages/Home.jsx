import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clubs, events } from '../data/mockData'
import ClubLogo from '../components/ClubLogo'
import ThemeToggle from '../components/ThemeToggle'
import './ClubLanding.css'

export default function Home() {
  const navigate = useNavigate()

  // State management
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [clubSearchTerm, setClubSearchTerm] = useState('')
  const [selectedClub, setSelectedClub] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Handle Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
        setSelectedClub(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter clubs by category and search term
  const filteredClubs = useMemo(() => {
    return clubs.filter(c => {
      const matchCat = 
        selectedCategory === 'All' ? true :
        selectedCategory === 'Technical' ? c.cat === 'Technical' :
        selectedCategory === 'Cultural' ? (c.cat === 'Cultural' || c.cat === 'Arts') :
        selectedCategory === 'Sports' ? c.cat === 'Sports' :
        selectedCategory === 'Social' ? (c.cat === 'Service' || c.cat === 'Uniformed' || c.cat === 'Social') :
        selectedCategory === 'Wellness' ? c.cat === 'Wellness' : true

      const matchSearch = clubSearchTerm.trim() === '' ? true :
        c.name.toLowerCase().includes(clubSearchTerm.toLowerCase()) ||
        c.fullName.toLowerCase().includes(clubSearchTerm.toLowerCase()) ||
        (c.desc && c.desc.toLowerCase().includes(clubSearchTerm.toLowerCase()))

      return matchCat && matchSearch
    })
  }, [selectedCategory, clubSearchTerm])

  // Category badge helper
  const getCategoryClass = (cat) => {
    const norm = String(cat || '').toLowerCase()
    if (norm.includes('tech')) return 'cat-tech'
    if (norm.includes('cult') || norm.includes('art')) return 'cat-cultural'
    if (norm.includes('sport')) return 'cat-sports'
    if (norm.includes('well') || norm.includes('yoga')) return 'cat-wellness'
    return 'cat-social'
  }

  // Top featured upcoming events (curated active/upcoming)
  const featuredEvents = useMemo(() => {
    return events
      .filter(e => e.statusOverride !== 'closed')
      .slice(0, 6)
  }, [])

  // Global search results for Ctrl+K dialog
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { clubs: clubs.slice(0, 3), events: featuredEvents.slice(0, 3) }
    const q = searchQuery.toLowerCase()
    return {
      clubs: clubs.filter(c => c.name.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q)),
      events: events.filter(e => e.title.toLowerCase().includes(q) || e.club.toLowerCase().includes(q))
    }
  }, [searchQuery, featuredEvents])

  return (
    <div className="club-root">
      {/* Warm Ambient Sandal Glow and Subtle Background Grid */}
      <div className="club-grid-bg" />
      <div className="club-ambient-glow" />

      {/* ====================================================================
          STICKY HEADER
          ==================================================================== */}
      <header className="club-header">
        <div className="club-header-inner">
          {/* Logo / Wordmark */}
          <Link to="/" className="club-brand">
            <div className="club-brand-mark">
              <span>🏛️</span>
            </div>
            <div>
              <div className="club-brand-title">
                CAMPUS CLUB HUB
                <span className="club-brand-tag">CENTRAL</span>
              </div>
              <div className="club-brand-sub">College Club Management System</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav>
            <ul className="club-nav-links">
              <li><a href="#clubs" className="club-nav-link">Available Clubs</a></li>
              <li><a href="#events" className="club-nav-link">Upcoming Events</a></li>
              <li><a href="#activities" className="club-nav-link">Activities</a></li>
              <li><a href="#participation" className="club-nav-link">How It Works</a></li>
              <li><a href="#portals" className="club-nav-link">Campus Portals</a></li>
            </ul>
          </nav>

          {/* Action CTAs */}
          <div className="club-header-actions">
            <button 
              className="club-search-trigger"
              onClick={() => setSearchOpen(true)}
              title="Search clubs and events (Ctrl + K)"
            >
              <span>🔍</span>
              <span>Search...</span>
              <span className="club-kbd">Ctrl K</span>
            </button>

            <ThemeToggle />

            <Link to="/login" className="club-btn-login">
              <span>🔑</span>
              <span>Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ====================================================================
          HERO SECTION
          Modern, welcoming, and attractive introduction to Club Management System
          ==================================================================== */}
      <section className="club-hero">
        <div className="club-container">
          {/* Welcoming Eyebrow Pill */}
          <div className="club-hero-badge">
            <span className="club-badge-dot" />
            <span className="club-badge-text">CENTRAL CAMPUS EVENT &amp; OD PLATFORM</span>
          </div>

          {/* New Campus-Oriented Hero Headline */}
          <h1 className="club-hero-title">
            Connect. Participate. <br />
            <span className="club-hero-title-highlight">Grow with Your Campus.</span>
          </h1>

          {/* Multi-Pillar Campus Description */}
          <p className="club-hero-desc">
            Discover student-led clubs, register for verified workshops &amp; hackathons, mark real-time venue attendance, obtain sanctioned On-Duty (OD) passes, and build your accredited university portfolio.
          </p>

          {/* Action-Oriented CTA Buttons */}
          <div className="club-hero-ctas" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <a href="#clubs" className="club-btn-explore">
              <span>🎯</span>
              <span>Explore Clubs</span>
            </a>
            <a href="#events" className="club-btn-explore" style={{ background: 'var(--club-surface-card)', color: 'var(--club-text-title)', border: '1.5px solid var(--club-border-subtle)' }}>
              <span>📅</span>
              <span>Browse Events</span>
            </a>
            <Link to="/login" className="club-btn-student-login">
              <span>📜</span>
              <span>Request OD / Portal Sign-In</span>
            </Link>
          </div>

          {/* Quick Credibility & Campus Activity Stats */}
          <div className="club-hero-stats">
            <div className="club-stat-pill">
              <span>🏛️</span>
              <span><b>8 Active</b> College Clubs</span>
            </div>
            <span className="club-stat-dot-sep">•</span>
            <div className="club-stat-pill">
              <span>👥</span>
              <span><b>1,850+</b> Student Members</span>
            </div>
            <span className="club-stat-dot-sep">•</span>
            <div className="club-stat-pill">
              <span>⚡</span>
              <span><b>100+</b> Yearly Events &amp; Workshops</span>
            </div>
            <span className="club-stat-dot-sep">•</span>
            <div className="club-stat-pill">
              <span>📜</span>
              <span><b>100%</b> On-Duty (OD) Approved</span>
            </div>
          </div>

          {/* Modern 4-Pillar Visual Interactive Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginTop: 36,
            textAlign: 'left'
          }}>
            <div className="card" style={{ padding: 18, background: 'var(--club-surface-card)', border: '1px solid var(--club-border-subtle)', borderRadius: 12, transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>👥</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--club-text-title)', marginBottom: 4 }}>1. Discover Clubs</div>
              <div style={{ fontSize: 12.5, color: 'var(--club-text-muted)', lineHeight: 1.5 }}>
                Browse recognized technical chapters, cultural guilds, athletic councils, and service societies with faculty leadership.
              </div>
            </div>

            <div className="card" style={{ padding: 18, background: 'var(--club-surface-card)', border: '1px solid var(--club-border-subtle)', borderRadius: 12, transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>🎟️</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--club-text-title)', marginBottom: 4 }}>2. Explore &amp; Register</div>
              <div style={{ fontSize: 12.5, color: 'var(--club-text-muted)', lineHeight: 1.5 }}>
                1-click event registration, digital passcode passes, team enrollment, and real-time seat availability tracking.
              </div>
            </div>

            <div className="card" style={{ padding: 18, background: 'var(--club-surface-card)', border: '1px solid var(--club-border-subtle)', borderRadius: 12, transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>📍</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--club-text-title)', marginBottom: 4 }}>3. Attend &amp; PIN Check-in</div>
              <div style={{ fontSize: 12.5, color: 'var(--club-text-muted)', lineHeight: 1.5 }}>
                Instant live attendance verification using 4-digit venue hall PINs, QR passes, and advisor check-in desks.
              </div>
            </div>

            <div className="card" style={{ padding: 18, background: 'var(--club-surface-card)', border: '1px solid var(--club-border-subtle)', borderRadius: 12, transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>📜</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--club-text-title)', marginBottom: 4 }}>4. Official Verified OD</div>
              <div style={{ fontSize: 12.5, color: 'var(--club-text-muted)', lineHeight: 1.5 }}>
                Formal attendance waiver requests reviewed by the Chief OD Officer with certificate verification and official pass generation.
              </div>
            </div>
          </div>

          {/* Featured Quick Spotlight Bar */}
          <div className="club-spotlight-bar" style={{ marginTop: 28 }}>
            <a href="#clubs" className="club-spotlight-item" onClick={() => setSelectedCategory('Technical')}>
              <div className="club-spotlight-icon">
                <ClubLogo clubName="CSI" size={26} />
              </div>
              <div>
                <div className="club-spotlight-name">CSI Chapter</div>
                <div className="club-spotlight-act">Coding &amp; Hackathons</div>
              </div>
            </a>

            <a href="#clubs" className="club-spotlight-item" onClick={() => setSelectedCategory('Technical')}>
              <div className="club-spotlight-icon">
                <ClubLogo clubName="IEEE" size={26} />
              </div>
              <div>
                <div className="club-spotlight-name">IEEE Branch</div>
                <div className="club-spotlight-act">Hardware &amp; IoT Labs</div>
              </div>
            </a>

            <a href="#clubs" className="club-spotlight-item" onClick={() => setSelectedCategory('Cultural')}>
              <div className="club-spotlight-icon">
                <ClubLogo clubName="Fine Arts" size={26} />
              </div>
              <div>
                <div className="club-spotlight-name">Fine Arts Guild</div>
                <div className="club-spotlight-act">Studio &amp; Wall Murals</div>
              </div>
            </a>

            <a href="#clubs" className="club-spotlight-item" onClick={() => setSelectedCategory('Sports')}>
              <div className="club-spotlight-icon">
                <ClubLogo clubName="Sports" size={26} />
              </div>
              <div>
                <div className="club-spotlight-name">Sports Council</div>
                <div className="club-spotlight-act">Knockouts &amp; Athletics</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 1: AVAILABLE CLUBS
          ==================================================================== */}
      <section id="clubs" className="club-section">
        <div className="club-container">
          <div className="club-section-header">
            <div className="club-section-eyebrow">
              <span>🏷️</span>
              <span>CAMPUS DIRECTORY</span>
            </div>
            <h2 className="club-section-title">Available College Clubs</h2>
            <p className="club-section-desc">
              Browse through our recognized clubs, review member benefits, view faculty advisors, and join the community that ignites your passion.
            </p>
          </div>

          {/* Filter Toolbar & Live Search */}
          <div className="club-filter-toolbar">
            <div className="club-category-pills">
              {['All', 'Technical', 'Cultural', 'Sports', 'Social', 'Wellness'].map(cat => (
                <button
                  key={cat}
                  className={`club-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'All' ? '🌟 All Clubs' :
                   cat === 'Technical' ? '💻 Technical' :
                   cat === 'Cultural' ? '🎨 Cultural' :
                   cat === 'Sports' ? '⚽ Sports' :
                   cat === 'Social' ? '🤝 Social Service' : '🧘 Wellness'}
                </button>
              ))}
            </div>

            <div className="club-search-input-wrap">
              <svg className="club-search-input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                className="club-search-input"
                placeholder="Filter by club name..."
                value={clubSearchTerm}
                onChange={(e) => setClubSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Club Cards Grid */}
          <div className="club-cards-grid">
            {filteredClubs.map(club => (
              <div key={club.id} className="club-card">
                <div>
                  <div className="club-card-top">
                    <div className="club-card-identity">
                      <div className="club-card-logo-wrap">
                        <ClubLogo clubName={club.name} size={30} />
                      </div>
                      <div>
                        <h3 className="club-card-name">{club.name}</h3>
                        <span className={`club-card-cat-badge ${getCategoryClass(club.cat)}`}>
                          {club.cat}
                        </span>
                      </div>
                    </div>

                    <span className="club-card-fee-pill">
                      {club.membershipFee === 0 ? 'Free Entry' : `₹${club.membershipFee}/yr`}
                    </span>
                  </div>

                  <p className="club-card-desc">{club.desc}</p>
                </div>

                <div>
                  <div className="club-card-stats">
                    <div>
                      <span className="club-card-stat-num">{club.members}</span>
                      <span> Members</span>
                    </div>
                    <span>•</span>
                    <div>
                      <span className="club-card-stat-num">{club.events}</span>
                      <span> Events</span>
                    </div>
                  </div>

                  <div className="club-card-advisor">
                    <span>👨‍🏫 Advisor:</span>
                    <b>{club.leadInstructor ? club.leadInstructor.split('(')[0] : 'Faculty Lead'}</b>
                  </div>

                  <div className="club-card-actions">
                    <button 
                      className="club-btn-details"
                      onClick={() => setSelectedClub(club)}
                    >
                      View Details
                    </button>
                    <Link to="/login/student" className="club-btn-join">
                      Join Club
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClubs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8C705B' }}>
              <p style={{ fontSize: '18px', fontWeight: 600 }}>No clubs matched your search.</p>
              <button 
                className="club-btn-details" 
                style={{ marginTop: '12px' }}
                onClick={() => { setSelectedCategory('All'); setClubSearchTerm(''); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: UPCOMING EVENTS
          ==================================================================== */}
      <section id="events" className="club-section club-section-alt">
        <div className="club-container">
          <div className="club-section-header">
            <div className="club-section-eyebrow">
              <span>📅</span>
              <span>CAMPUS CALENDAR</span>
            </div>
            <h2 className="club-section-title">Upcoming Events &amp; Workshops</h2>
            <p className="club-section-desc">
              Participate in hackathons, workshops, guest lectures, sports championships, and cultural festivals hosted by our clubs.
            </p>
          </div>

          <div className="club-events-grid">
            {featuredEvents.map(event => {
              const pct = Math.min(100, Math.round((event.registered / (event.capacity || 100)) * 100))
              return (
                <div key={event.id} className="club-event-card">
                  <div className="club-event-banner">
                    <img 
                      src={event.coverImage || event.posterUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"} 
                      alt={event.title} 
                      loading="lazy"
                    />
                    <div className="club-event-badge-overlay">
                      {event.club}
                    </div>
                    <div className="club-event-date-chip">
                      {event.date ? event.date.split('·')[0].trim() : 'Upcoming'}
                    </div>
                  </div>

                  <div className="club-event-body">
                    <div>
                      <h3 className="club-event-title">{event.title}</h3>
                      <p className="club-event-desc">{event.desc}</p>

                      <div className="club-event-meta-row">
                        <span className="club-event-meta-item">
                          <span>📍</span> {event.venue || 'Campus Auditorium'}
                        </span>
                        <span className="club-event-meta-item">
                          <span>🎟️</span> {event.fee || 'Free'}
                        </span>
                      </div>

                      <div className="club-event-progress-wrap">
                        <div className="club-event-progress-label">
                          <span>Registrations</span>
                          <span>{event.registered} / {event.capacity} seats</span>
                        </div>
                        <div className="club-event-progress-bar">
                          <div 
                            className="club-event-progress-fill" 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    </div>

                    <Link to="/login/student" className="club-btn-event-register">
                      Register via Student Portal →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: CLUB ACTIVITIES
          ==================================================================== */}
      <section id="activities" className="club-section">
        <div className="club-container">
          <div className="club-section-header">
            <div className="club-section-eyebrow">
              <span>⚡</span>
              <span>CAMPUS EXPERIENCE</span>
            </div>
            <h2 className="club-section-title">Vibrant Club Activities</h2>
            <p className="club-section-desc">
              Every week, college clubs organize hands-on initiatives that bridge theory with real-world practice, creativity, and community service.
            </p>
          </div>

          <div className="club-activities-grid">
            <div className="club-activity-card">
              <div className="club-activity-icon-box">💻</div>
              <h3 className="club-activity-title">Hands-On Workshops &amp; Bootcamps</h3>
              <p className="club-activity-text">
                Intensive weekend bootcamps on AI, Web3, PCB fabrication, and fullstack engineering led by senior peers and industry mentors.
              </p>
              <span className="club-activity-tag">SKILL DEVELOPMENT</span>
            </div>

            <div className="club-activity-card">
              <div className="club-activity-icon-box">🏆</div>
              <h3 className="club-activity-title">Hackathons &amp; Contests</h3>
              <p className="club-activity-text">
                24-hour sprint competitions, autonomous robotics arena battles, and coding leagues with cash prizes and startup mentorship.
              </p>
              <span className="club-activity-tag">COMPETITIVE SPRINT</span>
            </div>

            <div className="club-activity-card">
              <div className="club-activity-icon-box">🎨</div>
              <h3 className="club-activity-title">Campus Festivals &amp; Galas</h3>
              <p className="club-activity-text">
                Annual master art galas, eco-mural design drives, photography walks, and inter-departmental tournaments that unite the college.
              </p>
              <span className="club-activity-tag">CULTURE &amp; ARTS</span>
            </div>

            <div className="club-activity-card">
              <div className="club-activity-icon-box">📜</div>
              <h3 className="club-activity-title">Verified On-Duty (OD) &amp; Certificates</h3>
              <p className="club-activity-text">
                Direct integration with college academic clearance, allowing students to earn official On-Duty attendance and verifiable credentials.
              </p>
              <span className="club-activity-tag">ACADEMIC CLEARANCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: STUDENT PARTICIPATION (HOW IT WORKS + VOICES)
          ==================================================================== */}
      <section id="participation" className="club-section club-section-alt">
        <div className="club-container">
          <div className="club-section-header">
            <div className="club-section-eyebrow">
              <span>🚀</span>
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="club-section-title">How Student Participation Works</h2>
            <p className="club-section-desc">
              Joining a club and participating in campus activities is straightforward, transparent, and rewarding.
            </p>
          </div>

          {/* 3-Step Guide */}
          <div className="club-steps-grid">
            <div className="club-step-card">
              <div className="club-step-num-badge">01</div>
              <h3 className="club-step-title">Explore &amp; Pick Your Clubs</h3>
              <p className="club-step-text">
                Browse our centralized directory of 8 college clubs across technical, cultural, sports, and social service domains to find what fits your ambition.
              </p>
            </div>

            <div className="club-step-card">
              <div className="club-step-num-badge">02</div>
              <h3 className="club-step-title">Access Your Student Portal</h3>
              <p className="club-step-text">
                Sign in with your registered college email address and password to view event registrations, submit membership requests, and track participation.
              </p>
            </div>

            <div className="club-step-card">
              <div className="club-step-num-badge">03</div>
              <h3 className="club-step-title">Participate, Earn OD &amp; Lead</h3>
              <p className="club-step-text">
                Attend workshops and competitions, receive official On-Duty (OD) attendance passes, build verifiable credentials, and rise into student leadership.
              </p>
            </div>
          </div>

          {/* Student Voices / Testimonials */}
          <div className="club-stories-header">
            <h3 className="club-stories-title">Student Voices</h3>
            <p style={{ color: 'var(--club-text-muted)', fontSize: '14px', margin: 0 }}>
              Hear what active members have to say about their club journey.
            </p>
          </div>

          <div className="club-testimonials-grid">
            <div className="club-testimonial-card">
              <p className="club-testimonial-quote">
                "CSI gave me the platform to organize my first national hackathon and build real fullstack systems. The verified OD system ensured my academics never suffered."
              </p>
              <div className="club-testimonial-author">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" 
                  alt="Ananya Rao" 
                  className="club-author-avatar"
                />
                <div>
                  <div className="club-author-name">Ananya Rao</div>
                  <div className="club-author-role">3rd Year CSE · CSI Chapter Lead</div>
                </div>
              </div>
            </div>

            <div className="club-testimonial-card">
              <p className="club-testimonial-quote">
                "From soldering autonomous rovers in the IEEE lab to presenting at national symposiums, our student branch gave me practical hardware skills beyond the textbook."
              </p>
              <div className="club-testimonial-author">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" 
                  alt="Karthik Verma" 
                  className="club-author-avatar"
                />
                <div>
                  <div className="club-author-name">Karthik Verma</div>
                  <div className="club-author-role">2nd Year ECE · IEEE Hardware Wing</div>
                </div>
              </div>
            </div>

            <div className="club-testimonial-card">
              <p className="club-testimonial-quote">
                "The Fine Arts Guild let me design campus wall murals and exhibit my acrylic canvases in front of hundreds of visitors. It's the creative heart of our college."
              </p>
              <div className="club-testimonial-author">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Meera S." 
                  className="club-author-avatar"
                />
                <div>
                  <div className="club-author-name">Meera S.</div>
                  <div className="club-author-role">2nd Year Arch · Fine Arts Curator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          STUDENT EVENT -> OD WORKFLOW TIMELINE
          ==================================================================== */}
      <section id="workflow" className="club-section" style={{ background: 'var(--club-surface-card)', borderTop: '1px solid var(--club-border-subtle)', borderBottom: '1px solid var(--club-border-subtle)' }}>
        <div className="club-container">
          <div className="club-section-header">
            <div className="club-section-eyebrow">
              <span>⚡</span>
              <span>ACADEMIC WORKFLOW</span>
            </div>
            <h2 className="club-section-title">Student Event → On-Duty (OD) Lifecycle</h2>
            <p className="club-section-desc">
              From event discovery to sanctioned academic attendance waivers, our transparent 4-stage lifecycle ensures 100% compliance.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
            marginTop: 24
          }}>
            <div style={{
              background: 'var(--club-bg)',
              borderRadius: 14,
              padding: 24,
              border: '1.5px solid var(--club-border-subtle)',
              position: 'relative'
            }}>
              <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 6, background: 'rgba(194, 126, 67, 0.15)', color: 'var(--club-caramel-dark)', fontWeight: 800, fontSize: 11, fontFamily: 'var(--club-font-mono)', marginBottom: 12 }}>
                STAGE 01
              </div>
              <h3 style={{ fontSize: 17, margin: '0 0 8px', color: 'var(--club-text-title)' }}>1. Register for Event</h3>
              <p style={{ fontSize: 13, color: 'var(--club-text-body)', lineHeight: 1.5, margin: '0 0 12px' }}>
                Browse workshops and hackathons, review prerequisites, and click <b>"Register / I'm Attending"</b> to secure your digital pass.
              </p>
              <div style={{ fontSize: 11.5, color: 'var(--club-caramel)', fontWeight: 600 }}>Status: Confirmed Registration</div>
            </div>

            <div style={{
              background: 'var(--club-bg)',
              borderRadius: 14,
              padding: 24,
              border: '1.5px solid var(--club-border-subtle)',
              position: 'relative'
            }}>
              <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 6, background: 'rgba(217, 119, 6, 0.15)', color: '#B45309', fontWeight: 800, fontSize: 11, fontFamily: 'var(--club-font-mono)', marginBottom: 12 }}>
                STAGE 02
              </div>
              <h3 style={{ fontSize: 17, margin: '0 0 8px', color: 'var(--club-text-title)' }}>2. Request OD Clearance</h3>
              <p style={{ fontSize: 13, color: 'var(--club-text-body)', lineHeight: 1.5, margin: '0 0 12px' }}>
                Click <b>"Request OD"</b> from your event pass. Submit your academic details, event dates, timing, and invitation document for review.
              </p>
              <div style={{ fontSize: 11.5, color: '#B45309', fontWeight: 600 }}>Status: Pending OD Officer Review</div>
            </div>

            <div style={{
              background: 'var(--club-bg)',
              borderRadius: 14,
              padding: 24,
              border: '1.5px solid var(--club-border-subtle)',
              position: 'relative'
            }}>
              <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 6, background: 'rgba(77, 124, 71, 0.15)', color: 'var(--club-green)', fontWeight: 800, fontSize: 11, fontFamily: 'var(--club-font-mono)', marginBottom: 12 }}>
                STAGE 03
              </div>
              <h3 style={{ fontSize: 17, margin: '0 0 8px', color: 'var(--club-text-title)' }}>3. Live Attendance (PIN Check-in)</h3>
              <p style={{ fontSize: 13, color: 'var(--club-text-body)', lineHeight: 1.5, margin: '0 0 12px' }}>
                Arrive at the event venue and enter the projected <b>4-digit Venue PIN</b> or scan the live QR code to confirm physical presence.
              </p>
              <div style={{ fontSize: 11.5, color: 'var(--club-green)', fontWeight: 600 }}>Status: Attendance Confirmed (Present)</div>
            </div>

            <div style={{
              background: 'var(--club-bg)',
              borderRadius: 14,
              padding: 24,
              border: '1.5px solid var(--club-border-subtle)',
              position: 'relative'
            }}>
              <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 6, background: 'rgba(124, 58, 237, 0.15)', color: '#7C3AED', fontWeight: 800, fontSize: 11, fontFamily: 'var(--club-font-mono)', marginBottom: 12 }}>
                STAGE 04
              </div>
              <h3 style={{ fontSize: 17, margin: '0 0 8px', color: 'var(--club-text-title)' }}>4. Certificate &amp; OD Sanctioned</h3>
              <p style={{ fontSize: 13, color: 'var(--club-text-body)', lineHeight: 1.5, margin: '0 0 12px' }}>
                Upload your participation certificate. The OD Officer verifies proof authenticity and issues the <b>"On Duty — Verified"</b> pass with official QR.
              </p>
              <div style={{ fontSize: 11.5, color: '#7C3AED', fontWeight: 600 }}>Status: On Duty — Verified (OD Issued)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: CAMPUS PORTALS (ROLE ACCESS)
          ==================================================================== */}
      <section id="portals" className="club-section">
        <div className="club-container">
          <div className="club-section-header">
            <div className="club-section-eyebrow">
              <span>🔐</span>
              <span>INSTITUTIONAL LOGIN</span>
            </div>
            <h2 className="club-section-title">Institutional Campus Portals</h2>
            <p className="club-section-desc">
              Single sign-in for all collegiate roles. The system automatically routes you to your authorized dashboard upon login.
            </p>
          </div>

          <div className="club-portals-grid">
            <div className="club-portal-box">
              <div>
                <div className="club-portal-icon">🎓</div>
                <h3 className="club-portal-name">Student Portal</h3>
                <p className="club-portal-desc">
                  Browse events, join clubs, download entry passes, apply for OD permissions, and view your activity portfolio.
                </p>
              </div>
              <Link to="/login" className="club-portal-btn">
                <span>Sign In to Student Portal</span>
                <span>→</span>
              </Link>
            </div>

            <div className="club-portal-box">
              <div>
                <div className="club-portal-icon">👨‍🏫</div>
                <h3 className="club-portal-name">Club Advisor Portal</h3>
                <p className="club-portal-desc">
                  Manage club membership approvals, schedule upcoming events, post student achievements, and record attendance.
                </p>
              </div>
              <Link to="/login" className="club-portal-btn">
                <span>Sign In as Advisor</span>
                <span>→</span>
              </Link>
            </div>

            <div className="club-portal-box">
              <div>
                <div className="club-portal-icon">🏛️</div>
                <h3 className="club-portal-name">OD In-Charge Portal</h3>
                <p className="club-portal-desc">
                  Review student academic absence permission requests, verify contest participation, and issue official OD passes.
                </p>
              </div>
              <Link to="/login" className="club-portal-btn">
                <span>Sign In as OD Officer</span>
                <span>→</span>
              </Link>
            </div>

            <div className="club-portal-box">
              <div>
                <div className="club-portal-icon">🛡️</div>
                <h3 className="club-portal-name">Super Admin Portal</h3>
                <p className="club-portal-desc">
                  Oversee all collegiate clubs, assign faculty advisors, moderate campus activities, and monitor university analytics.
                </p>
              </div>
              <Link to="/login" className="club-portal-btn">
                <span>Sign In as Administrator</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          CALL TO ACTION BANNER
          ==================================================================== */}
      <section className="club-section" style={{ paddingTop: 0 }}>
        <div className="club-container">
          <div className="club-cta-banner">
            <h2 className="club-cta-title">Ready to Make the Most of Campus Life?</h2>
            <p className="club-cta-desc">
              Join over 1,850 students exploring passions, mastering practical skills, and building lifelong connections across campus.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#clubs" className="club-btn-explore">
                <span>🎯</span>
                <span>Explore All Clubs</span>
              </a>
              <Link to="/login" className="club-btn-student-login">
                <span>🔑</span>
                <span>Login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FOOTER
          ==================================================================== */}
      <footer className="club-footer">
        <div className="club-container">
          <div className="club-footer-grid">
            <div>
              <div className="club-brand" style={{ marginBottom: '14px' }}>
                <div className="club-brand-mark">🏛️</div>
                <div className="club-brand-title">CAMPUS CLUB HUB</div>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--club-text-body)', maxWidth: '320px', margin: '0 0 16px' }}>
                The centralized college platform for club discovery, student engagement, event registrations, and verified academic On-Duty clearance.
              </p>
              <div style={{ fontSize: '12px', color: 'var(--club-text-muted)' }}>
                Office of Student Affairs · Main Academic Block
              </div>
            </div>

            <div>
              <div className="club-footer-col-title">Navigation</div>
              <ul className="club-footer-links">
                <li><a href="#clubs" className="club-footer-link">Available Clubs</a></li>
                <li><a href="#events" className="club-footer-link">Upcoming Events</a></li>
                <li><a href="#activities" className="club-footer-link">Club Activities</a></li>
                <li><a href="#participation" className="club-footer-link">How It Works</a></li>
              </ul>
            </div>

            <div>
              <div className="club-footer-col-title">Portals</div>
              <ul className="club-footer-links">
                <li><Link to="/login/student" className="club-footer-link">Student Portal</Link></li>
                <li><Link to="/login/instructor" className="club-footer-link">Club Advisor</Link></li>
                <li><Link to="/login/od" className="club-footer-link">OD In-Charge</Link></li>
                <li><Link to="/login/admin" className="club-footer-link">Super Administrator</Link></li>
              </ul>
            </div>

            <div>
              <div className="club-footer-col-title">Help &amp; Guidelines</div>
              <ul className="club-footer-links">
                <li><Link to="/login/student" className="club-footer-link">Student Code of Conduct</Link></li>
                <li><Link to="/login/student" className="club-footer-link">OD Policy Guidelines</Link></li>
                <li><Link to="/login/student" className="club-footer-link">Club Charter Rules</Link></li>
                <li><a href="mailto:support@college.edu" className="club-footer-link">support@college.edu</a></li>
              </ul>
            </div>
          </div>

          <div className="club-footer-bottom">
            <div>
              © 2026 College Campus Club Management System. All rights reserved.
            </div>
            <div>
              Designed for Collegiate Student Communities
            </div>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          INTERACTIVE CLUB DETAILS MODAL
          ==================================================================== */}
      {selectedClub && (
        <div className="club-modal-overlay" onClick={() => setSelectedClub(null)}>
          <div className="club-modal-box" onClick={(e) => e.stopPropagation()}>
            <button 
              className="club-modal-close" 
              onClick={() => setSelectedClub(null)}
              aria-label="Close Modal"
            >
              ✕
            </button>

            <div className="club-modal-header">
              <div className="club-modal-logo">
                <ClubLogo clubName={selectedClub.name} size={36} />
              </div>
              <div>
                <h3 className="club-modal-title">{selectedClub.name}</h3>
                <div className="club-modal-full-name">{selectedClub.fullName}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <span className={`club-card-cat-badge ${getCategoryClass(selectedClub.cat)}`}>
                    {selectedClub.cat}
                  </span>
                  <span className="club-card-fee-pill">
                    {selectedClub.membershipFee === 0 ? 'Free Entry' : `₹${selectedClub.membershipFee}/year`}
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--club-text-body)', margin: '0 0 16px' }}>
              {selectedClub.longDesc || selectedClub.desc}
            </p>

            {/* Perks List */}
            {selectedClub.perks && selectedClub.perks.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--club-text-title)', marginBottom: '8px' }}>
                  Member Benefits &amp; Perks
                </div>
                <ul className="club-modal-perks">
                  {selectedClub.perks.map((perk, i) => (
                    <li key={i} className="club-modal-perk-item">
                      <span className="club-perk-check">✓</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility & Advisor */}
            <div style={{ background: 'var(--club-surface-accent)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12.5px', color: 'var(--club-text-body)', marginBottom: '6px' }}>
                <b>Eligibility:</b> {selectedClub.eligibility || 'Open to all enrolled students.'}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--club-text-body)' }}>
                <b>Faculty Advisor:</b> {selectedClub.leadInstructor || 'Department Faculty Lead'}
              </div>
            </div>

            {/* Student Leadership Team */}
            {selectedClub.studentTeam && selectedClub.studentTeam.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--club-text-title)', marginBottom: '8px' }}>
                  Student Leadership Team
                </div>
                <div className="club-modal-team-grid">
                  {selectedClub.studentTeam.map((member, i) => (
                    <div key={i} className="club-modal-team-member">
                      <img 
                        src={member.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"} 
                        alt={member.name}
                        className="club-modal-team-avatar"
                      />
                      <div className="club-modal-team-info">
                        <span className="club-modal-team-name">{member.name}</span>
                        <span className="club-modal-team-role">{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link 
              to="/login/student" 
              className="club-btn-modal-join"
              onClick={() => setSelectedClub(null)}
            >
              Login as Student to Join {selectedClub.name} →
            </Link>
          </div>
        </div>
      )}

      {/* ====================================================================
          SEARCH MODAL (Ctrl + K)
          ==================================================================== */}
      {searchOpen && (
        <div className="club-modal-overlay" onClick={() => setSearchOpen(false)}>
          <div className="club-search-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="club-search-modal-header">
              <span style={{ fontSize: '18px' }}>🔍</span>
              <input
                type="text"
                autoFocus
                className="club-search-modal-input"
                placeholder="Search clubs, hackathons, sports, or workshops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#8C705B' }}
              >
                ESC
              </button>
            </div>

            <div className="club-search-results-list">
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--club-text-muted)', padding: '6px 8px 2px' }}>
                Clubs ({searchResults.clubs.length})
              </div>
              {searchResults.clubs.map(c => (
                <div 
                  key={c.id} 
                  className="club-search-result-item"
                  onClick={() => {
                    setSelectedClub(c)
                    setSearchOpen(false)
                  }}
                >
                  <div className="club-search-result-main">
                    <ClubLogo clubName={c.name} size={24} />
                    <div>
                      <div className="club-search-result-title">{c.name} – {c.fullName}</div>
                      <div className="club-search-result-sub">{c.members} members · {c.cat}</div>
                    </div>
                  </div>
                  <span className="club-kbd">View Details</span>
                </div>
              ))}

              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--club-text-muted)', padding: '12px 8px 2px' }}>
                Events ({searchResults.events.length})
              </div>
              {searchResults.events.map(ev => (
                <Link 
                  key={ev.id} 
                  to="/login/student"
                  className="club-search-result-item"
                  onClick={() => setSearchOpen(false)}
                >
                  <div className="club-search-result-main">
                    <span style={{ fontSize: '18px' }}>📅</span>
                    <div>
                      <div className="club-search-result-title">{ev.title}</div>
                      <div className="club-search-result-sub">{ev.club} · {ev.date} · {ev.venue}</div>
                    </div>
                  </div>
                  <span className="club-kbd">Register</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
