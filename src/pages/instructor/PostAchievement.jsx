import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'

const PRESET_COVERS = [
  { label: '🏆 Hackathon & Coding Victory', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80' },
  { label: '🔬 IEEE Lab & Research', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
  { label: '🤖 Robotics & Hardware Arena', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80' },
  { label: '🎨 Art Gallery & Cultural Gold', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80' },
  { label: '⚽ Sports & Athletics Championship', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80' },
  { label: '🤝 NSS Community Outreach', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80' }
]

const CATEGORIES = ['Hackathon Victory', 'Research Breakthrough', 'Cultural Championship', 'Sports Title', 'Community Impact']

export default function PostAchievement() {
  const { achievements, clubs, addAchievementArticle } = useData()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [clubName, setClubName] = useState(user?.assignedClub || 'CSI')
  const [category, setCategory] = useState('Hackathon Victory')
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url)
  const [customImageUrl, setCustomImageUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [winners, setWinners] = useState([
    { name: 'Rahul K.', rollNo: '22CS104', dept: 'CSE 3rd Year', role: 'Team Lead' }
  ])
  const [showPreview, setShowPreview] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  const handleAddWinner = () => {
    setWinners([...winners, { name: '', rollNo: '', dept: '', role: '' }])
  }

  const handleUpdateWinner = (index, field, value) => {
    const updated = [...winners]
    updated[index][field] = value
    setWinners(updated)
  }

  const handleRemoveWinner = (index) => {
    setWinners(winners.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const finalCover = customImageUrl.trim() || coverImage

    addAchievementArticle({
      title: title.trim(),
      subtitle: subtitle.trim() || summary.trim(),
      club: clubName,
      category,
      coverImage: finalCover,
      summary: summary.trim() || subtitle.trim(),
      content: content.trim() || summary.trim(),
      winners: winners.filter(w => w.name.trim() !== ''),
      author: {
        name: user?.name || "Dr. K. Ramanathan",
        role: `Faculty Advisor, ${clubName}`,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
      }
    })

    setPublishSuccess(true)
    setTitle('')
    setSubtitle('')
    setSummary('')
    setContent('')
    setWinners([{ name: '', rollNo: '', dept: '', role: '' }])
    setTimeout(() => setPublishSuccess(false), 4000)
  }

  return (
    <DashboardLayout role="instructor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Publish Achievement Article</h1>
          <p className="muted" style={{ margin: 0 }}>
            Share high-impact student victories, awards, cash prizes, and research papers in a full media-rich article format with photos.
          </p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? '✏️ Edit Article' : '👁️ Live Preview'}
        </button>
      </div>

      {publishSuccess && (
        <div className="card" style={{ background: 'var(--green-soft)', border: '1px solid #BBF7D0', color: '#14532D', padding: 16, marginBottom: 20 }}>
          ✓ <b>Article Published Successfully!</b> The achievement story is now live in the student magazine feed and club profile.
        </div>
      )}

      {showPreview ? (
        /* LIVE ARTICLE PREVIEW MODE */
        <div className="card" style={{ padding: 32, marginBottom: 28, border: '2px dashed var(--indigo)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--indigo)', marginBottom: 12 }}>
            Article Reader Preview Mode
          </div>

          <div style={{ height: 260, borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
            <img src={customImageUrl || coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <span className="badge tag-indigo">{clubName} Chapter</span>
            <span className="badge tag-purple">{category}</span>
          </div>

          <h1 style={{ fontSize: 28, marginBottom: 10 }}>{title || 'Article Headline Here'}</h1>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', fontStyle: 'italic', marginBottom: 16 }}>
            {subtitle || 'Article subtitle and summary snippet will appear here...'}
          </p>

          <div style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            {content ? content.split('\n').map((p, i) => <p key={i}>{p}</p>) : <p>{summary || 'Full article story content will render here.'}</p>}
          </div>

          {winners.some(w => w.name) && (
            <div>
              <div className="section-title" style={{ fontSize: 16, marginBottom: 10 }}>🏆 Honored Winners</div>
              <div className="winner-card-grid">
                {winners.filter(w => w.name).map((w, idx) => (
                  <div className="winner-badge-box" key={idx}>
                    <div style={{ fontWeight: 700 }}>{w.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--indigo)' }}>{w.rollNo} · {w.dept}</div>
                    <div className="muted" style={{ fontSize: 11 }}>Role: {w.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Looks Great — Publish Story Now →
            </button>
          </div>
        </div>
      ) : (
        /* COMPOSER FORM */
        <form onSubmit={handleSubmit} className="card" style={{ padding: 28, marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>
            <div className="field">
              <label>Article Headline / Title *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 1st Place Victory at National Hackathon 24hr 2026"
                required
              />
            </div>
              <div className="field">
                <label>Club / Society *</label>
                <input value={`${clubName} Society`} readOnly aria-readonly="true" />
              </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Achievement Category *</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Subtitle / Hook</label>
              <input
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="e.g. Team 'ByteForce' engineered an AI disaster relief protocol, bagging ₹50,000"
              />
            </div>
          </div>

          {/* Picture / Cover Photo Picker */}
          <div className="field">
            <label>Cover Photo / Event Picture *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 12 }}>
              {PRESET_COVERS.map(preset => (
                <div
                  key={preset.url}
                  onClick={() => { setCoverImage(preset.url); setCustomImageUrl('') }}
                  style={{
                    border: coverImage === preset.url && !customImageUrl ? '2px solid var(--indigo)' : '1px solid var(--border)',
                    borderRadius: 10,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <img src={preset.url} alt={preset.label} style={{ width: '100%', height: 75, objectFit: 'cover' }} />
                  <div style={{ fontSize: 10, fontWeight: 600, padding: '4px 6px', background: 'var(--card)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {preset.label}
                  </div>
                </div>
              ))}
            </div>
            <input
              value={customImageUrl}
              onChange={e => setCustomImageUrl(e.target.value)}
              placeholder="Or paste any custom image URL (https://...)"
            />
          </div>

          <div className="field">
            <label>Short Summary / Highlight</label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="A brief executive summary of what was accomplished..."
            />
          </div>

          <div className="field">
            <label>Full Story & Technical Insights (Markdown & Paragraphs supported) *</label>
            <textarea
              rows={5}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tell the full story of the event, challenges solved, jury remarks, prizes won, and student dedication..."
            />
          </div>

          {/* Winners & Honorees Builder */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label style={{ margin: 0 }}>🏆 Winners & Team Roster</label>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleAddWinner}>
                + Add Student Honoree
              </button>
            </div>

            {winners.map((winner, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 1fr auto', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <input
                  placeholder="Student Name (e.g. Rahul K.)"
                  value={winner.name}
                  onChange={e => handleUpdateWinner(idx, 'name', e.target.value)}
                />
                <input
                  placeholder="Roll No (e.g. 22CS104)"
                  value={winner.rollNo}
                  onChange={e => handleUpdateWinner(idx, 'rollNo', e.target.value)}
                />
                <input
                  placeholder="Dept & Year (e.g. CSE 3rd Year)"
                  value={winner.dept}
                  onChange={e => handleUpdateWinner(idx, 'dept', e.target.value)}
                />
                <input
                  placeholder="Role / Prize (e.g. 1st Place / Lead)"
                  value={winner.role}
                  onChange={e => handleUpdateWinner(idx, 'role', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveWinner(idx)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: 16, cursor: 'pointer' }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowPreview(true)}>
              Preview Article
            </button>
            <button type="submit" className="btn btn-amber">
              📰 Publish Article to Campus Feed
            </button>
          </div>
        </form>
      )}

      {/* Published Articles List */}
      <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>Published Chapter Articles</div>
      <div className="card-grid">
        {achievements.map(a => (
          <div className="article-card" key={a.id}>
            <img src={a.coverImage} alt={a.title} className="article-cover" />
            <div className="article-content">
              <div>
                <span className={`card-tag ${a.tagClass}`} style={{ fontSize: 9 }}>{a.club}</span>
                <h3 style={{ fontSize: 14.5, marginBottom: 6 }}>{a.title}</h3>
                <p className="muted" style={{ fontSize: 12, margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {a.summary || a.subtitle}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 11 }}>
                <span className="mono muted">📅 {a.date}</span>
                <span style={{ color: 'var(--indigo)', fontWeight: 600 }}>👏 {a.reactions?.claps || 0} claps</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
