import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'

const CATEGORIES = ['All Stories', 'Hackathon Victory', 'Research Breakthrough', 'Cultural Championship', 'Community Impact']

export default function Achievements() {
  const { achievements, reactToAchievement, addAchievementComment } = useData()
  const { user } = useAuth()
  const [category, setCategory] = useState('All Stories')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [commentText, setCommentText] = useState('')

  const filtered = achievements.filter(a => {
    if (category === 'All Stories') return true
    return a.category === category
  })

  const hero = filtered[0] || achievements[0]
  const rest = filtered.filter(a => a.id !== hero?.id)

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim() || !selectedArticle) return
    addAchievementComment(selectedArticle.id, {
      author: user?.name || "Student",
      text: commentText.trim()
    })
    // Update local selectedArticle comments view
    setSelectedArticle(prev => ({
      ...prev,
      comments: [
        ...(prev.comments || []),
        {
          id: Date.now(),
          author: user?.name || "Student",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
          text: commentText.trim(),
          time: "Just now"
        }
      ]
    }))
    setCommentText('')
  }

  const handleReaction = (type) => {
    if (!selectedArticle) return
    reactToAchievement(selectedArticle.id, type)
    setSelectedArticle(prev => ({
      ...prev,
      reactions: {
        ...prev.reactions,
        [type]: (prev.reactions[type] || 0) + 1
      }
    }))
  }

  return (
    <DashboardLayout role="student">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Campus Achievements & Stories</h1>
        <p className="muted" style={{ margin: 0 }}>
          Celebrate outstanding triumphs, hackathon championships, research papers, and cultural milestones.
        </p>
      </div>

      {/* Category Chips */}
      <div className="chip-row" style={{ marginBottom: 24 }}>
        {CATEGORIES.map(c => (
          <div
            key={c}
            className={'chip' + (c === category ? ' on' : '')}
            onClick={() => setCategory(c)}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Featured Hero Article */}
      {hero && (
        <div className="hero-article" onClick={() => setSelectedArticle(hero)} style={{ cursor: 'pointer' }}>
          <img src={hero.coverImage} alt={hero.title} className="hero-cover" />
          <div className="hero-body">
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <span className={`card-tag ${hero.tagClass}`} style={{ margin: 0 }}>{hero.club}</span>
                <span className="badge tag-indigo">{hero.category}</span>
                <span className="mono muted" style={{ fontSize: 11 }}>{hero.readTime || '3 min read'}</span>
              </div>
              <h2 style={{ fontSize: 22, lineHeight: 1.3, marginBottom: 10 }}>{hero.title}</h2>
              <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
                {hero.subtitle || hero.summary}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div className="author-badge">
                <img src={hero.author?.avatar} alt={hero.author?.name} className="author-avatar" />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{hero.author?.name}</div>
                  <div className="muted" style={{ fontSize: 10.5 }}>{hero.date}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <span className="reaction-pill">👏 {hero.reactions?.claps || 0}</span>
                <span className="reaction-pill">🏆 {hero.reactions?.trophies || 0}</span>
                <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedArticle(hero) }}>
                  Read Full Story →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Articles */}
      <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>More Campus Stories</div>
      <div className="card-grid">
        {rest.map(article => (
          <div className="article-card" key={article.id} onClick={() => setSelectedArticle(article)}>
            <img src={article.coverImage} alt={article.title} className="article-cover" />
            <div className="article-content">
              <div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <span className={`card-tag ${article.tagClass}`} style={{ margin: 0, fontSize: 9 }}>{article.club}</span>
                  <span className="badge tag-slate" style={{ fontSize: 9 }}>{article.category}</span>
                </div>
                <h3 style={{ fontSize: 15, lineHeight: 1.35, marginBottom: 8 }}>{article.title}</h3>
                <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.summary || article.subtitle}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <span className="muted mono" style={{ fontSize: 11 }}>📅 {article.date}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="reaction-pill" style={{ padding: '3px 7px', fontSize: 10.5 }}>👏 {article.reactions?.claps || 0}</span>
                    <span className="reaction-pill" style={{ padding: '3px 7px', fontSize: 10.5 }}>🏆 {article.reactions?.trophies || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="modal-backdrop" onClick={() => setSelectedArticle(null)}>
          <div className="modal-article-dialog" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedArticle(null)} title="Close">✕</button>

            {/* Cover Picture */}
            <div style={{ maxHeight: 340, overflow: 'hidden', borderTopLeftRadius: 22, borderTopRightRadius: 22 }}>
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ padding: '28px 36px 40px' }}>
              {/* Header tags */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <span className={`card-tag ${selectedArticle.tagClass}`} style={{ margin: 0 }}>{selectedArticle.club}</span>
                <span className="badge tag-indigo">{selectedArticle.category}</span>
                <span className="mono muted" style={{ fontSize: 11.5 }}>Published on {selectedArticle.date}</span>
              </div>

              <h1 style={{ fontSize: 28, lineHeight: 1.25, marginBottom: 12 }}>{selectedArticle.title}</h1>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)', fontStyle: 'italic', marginBottom: 20 }}>
                {selectedArticle.subtitle}
              </p>

              {/* Author Strip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
                <img src={selectedArticle.author?.avatar} alt={selectedArticle.author?.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{selectedArticle.author?.name}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{selectedArticle.author?.role || `${selectedArticle.club} Faculty Lead`}</div>
                </div>
              </div>

              {/* Article Body Content */}
              <div className="article-story-prose">
                {selectedArticle.content ? (
                  selectedArticle.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={idx} style={{ fontSize: 18, margin: '24px 0 10px' }}>{paragraph.replace('### ', '')}</h3>
                    }
                    if (paragraph.startsWith('> ')) {
                      return <blockquote key={idx}>{paragraph.replace('> ', '')}</blockquote>
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={idx} style={{ paddingLeft: 20, margin: '10px 0' }}>
                          {paragraph.split('\n').map((item, i) => (
                            <li key={i} style={{ marginBottom: 6 }}>{item.replace('- ', '')}</li>
                          ))}
                        </ul>
                      )
                    }
                    return <p key={idx}>{paragraph}</p>
                  })
                ) : (
                  <p>{selectedArticle.summary}</p>
                )}
              </div>

              {/* Winners & Standout Performers */}
              {selectedArticle.winners && selectedArticle.winners.length > 0 && (
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <div className="section-title" style={{ fontSize: 17, marginBottom: 14 }}>🏆 Honored Winners & Standouts</div>
                  <div className="winner-card-grid">
                    {selectedArticle.winners.map((w, idx) => (
                      <div className="winner-badge-box" key={idx}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>{w.name}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--indigo)' }}>{w.rollNo} · {w.dept}</div>
                        <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>Role: {w.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Photos */}
              {selectedArticle.gallery && selectedArticle.gallery.length > 1 && (
                <div style={{ marginTop: 24 }}>
                  <div className="section-title" style={{ fontSize: 16, marginBottom: 12 }}>📸 Event Photos</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    {selectedArticle.gallery.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt="Gallery snapshot"
                        style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Reactions */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 28, padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Celebrate this triumph:</span>
                <button className="reaction-pill" onClick={() => handleReaction('claps')}>
                  👏 Claps ({selectedArticle.reactions?.claps || 0})
                </button>
                <button className="reaction-pill" onClick={() => handleReaction('trophies')}>
                  🏆 Proud ({selectedArticle.reactions?.trophies || 0})
                </button>
                <button className="reaction-pill" onClick={() => handleReaction('fire')}>
                  🔥 Inspiring ({selectedArticle.reactions?.fire || 0})
                </button>
              </div>

              {/* Congratulatory Comments */}
              <div style={{ marginTop: 24 }}>
                <div className="section-title" style={{ fontSize: 16, marginBottom: 12 }}>
                  💬 Student & Faculty Messages ({selectedArticle.comments?.length || 0})
                </div>

                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Write a congratulatory message..."
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)' }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Post</button>
                </form>

                <div>
                  {selectedArticle.comments && selectedArticle.comments.map(c => (
                    <div key={c.id} style={{ display: 'flex', gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                      <img src={c.avatar} alt={c.author} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>
                          {c.author} <span className="muted" style={{ fontWeight: 400, fontSize: 10.5 }}>· {c.time}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--ink)', marginTop: 2 }}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
