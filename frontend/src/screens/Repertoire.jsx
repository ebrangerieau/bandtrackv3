import { useState, useEffect } from 'react'
import { alpha, glow, STATUS } from '../theme.js'
import * as api from '../api.js'
import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import LevelBar from '../components/LevelBar.jsx'

const STATUS_TABS = [
  { id: 'learning',   label: 'En cours', icon: '📚' },
  { id: 'ready',      label: 'Prêts',    icon: '✅' },
  { id: 'suggestion', label: 'Idées',    icon: '💡' },
  { id: 'archived',   label: 'Archivés', icon: '📦' },
]

export default function Repertoire({ palette, user, navigate, onSongTap }) {
  const [activeTab, setActiveTab] = useState('learning')
  const [songs, setSongs] = useState([])
  const [counts, setCounts] = useState({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addTitle, setAddTitle] = useState('')
  const [addAuthor, setAddAuthor] = useState('')
  const [addStatus, setAddStatus] = useState('suggestion')
  const [addError, setAddError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadSongs = () => {
    api.getSongs().then(all => {
      const c = {}
      STATUS_TABS.forEach(t => { c[t.id] = all.filter(s => s.status === t.id).length })
      setCounts(c)
      setSongs(all)
      setLoading(false)
    }).catch(console.error)
  }

  useEffect(() => { loadSongs() }, [])

  const visible = songs
    .filter(s => s.status === activeTab)
    .filter(s => !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.author.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = async (e) => {
    e.preventDefault()
    setAddError('')
    if (!addTitle.trim() || !addAuthor.trim()) { setAddError('Titre et artiste requis'); return }
    setSaving(true)
    try {
      await api.createSong({ title: addTitle.trim(), author: addAuthor.trim(), status: addStatus })
      setShowAdd(false)
      setAddTitle(''); setAddAuthor(''); setAddStatus('suggestion')
      loadSongs()
    } catch (err) {
      setAddError(err.data?.error || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${palette.border}`,
    background: palette.surface2, color: palette.text, fontSize: 14, outline: 'none',
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: palette.bg, color: palette.text, fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: 14 }}>
      <StatusBar palette={palette} />

      <div style={{ position: 'absolute', inset: 0, paddingTop: 47, paddingBottom: 110, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: palette.muted, fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              {songs.filter(s => s.status !== 'archived').length} morceaux
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1 }}>Répertoire</div>
          </div>
          <button onClick={() => setShowAdd(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
            color: '#fff', fontSize: 13, fontWeight: 700,
            boxShadow: glow(palette.accent, 0.45, 14),
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M7 2v10M2 7h10"/></svg>
            Ajouter
          </button>
        </div>

        {/* Status tabs */}
        <div className="bt-no-scroll" style={{ display: 'flex', gap: 7, padding: '4px 20px 8px', overflowX: 'auto', flexShrink: 0 }}>
          {STATUS_TABS.map(t => {
            const on = t.id === activeTab
            const c = STATUS[t.id].color
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 13px', borderRadius: 999, cursor: 'pointer',
                border: on ? `1px solid ${alpha(c, 0.5)}` : `1px solid ${palette.border}`,
                background: on ? alpha(c, 0.15) : palette.surface,
                color: on ? c : palette.muted, fontSize: 12.5, fontWeight: 700,
                whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: on ? glow(c, 0.25, 10) : 'none',
                transition: 'all 200ms ease',
              }}>
                <span style={{ fontSize: 12 }}>{t.icon}</span>
                {t.label}
                <span style={{
                  fontSize: 10.5, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
                  background: on ? alpha(c, 0.3) : alpha(palette.text, 0.06),
                  color: on ? c : palette.dim,
                }}>{counts[t.id] || 0}</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ padding: '4px 20px 10px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 12px', borderRadius: 10,
            background: palette.surface, border: `1px solid ${palette.border}`,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={palette.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/></svg>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un morceau…"
              style={{ flex: 1, border: 'none', background: 'transparent', color: palette.text, fontSize: 12, outline: 'none' }}
            />
          </div>
        </div>

        {/* Song list */}
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.muted }}>Chargement…</div>
        ) : (
          <div key={activeTab} className="bt-stagger bt-no-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visible.map(s => {
              const avg = s.avg_level || 0
              const c = STATUS[s.status].color
              return (
                <div key={s.id} onClick={() => onSongTap && onSongTap(s.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 10, borderRadius: 14,
                  background: palette.surface, border: `1px solid ${palette.border}`,
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                    background: `linear-gradient(135deg, ${alpha(c, 0.85)}, ${alpha(c, 0.55)})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: glow(c, 0.3, 10),
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="#fff" stroke="none"/><circle cx="18" cy="16" r="3" fill="#fff" stroke="none"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: -0.2 }}>{s.title}</div>
                    <div style={{ fontSize: 11.5, color: palette.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{s.author}</div>
                  </div>
                  {avg > 0 && (
                    <div style={{ width: 56, flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{avg.toFixed(1)}</div>
                      <LevelBar value={avg} palette={palette} height={4} />
                    </div>
                  )}
                  {avg === 0 && <div style={{ fontSize: 11, color: palette.dim, fontWeight: 600, fontStyle: 'italic' }}>nouveau</div>}
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke={palette.dim} strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M2 2l5 5-5 5"/></svg>
                </div>
              )
            })}
            {visible.length === 0 && (
              <div style={{ marginTop: 40, textAlign: 'center', color: palette.dim, fontSize: 13 }}>
                <div style={{ fontSize: 38, marginBottom: 8 }}>📭</div>
                {search ? 'Aucun résultat' : 'Aucun morceau dans cette catégorie'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add song modal */}
      {showAdd && (
        <div style={{
          position: 'absolute', inset: 0, background: alpha('#000', 0.6),
          backdropFilter: 'blur(8px)', zIndex: 60,
          display: 'flex', alignItems: 'flex-end',
        }} onClick={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} onClick={e => e.stopPropagation()} style={{
            width: '100%', background: palette.surface2, borderRadius: '20px 20px 0 0',
            padding: '20px 20px 36px',
            border: `1px solid ${palette.border}`, borderBottom: 'none',
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: palette.border, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.4, marginBottom: 16 }}>Nouveau morceau</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="text" placeholder="Titre" value={addTitle} onChange={e => setAddTitle(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="Artiste" value={addAuthor} onChange={e => setAddAuthor(e.target.value)} style={inputStyle} />
              <select value={addStatus} onChange={e => setAddStatus(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="suggestion">💡 Idée</option>
                <option value="learning">📚 En apprentissage</option>
                <option value="ready">✅ Prêt à jouer</option>
              </select>
            </div>
            {addError && <div style={{ marginTop: 8, color: '#f87171', fontSize: 12.5 }}>{addError}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button type="button" onClick={() => setShowAdd(false)} style={{
                flex: 1, padding: '13px 0', borderRadius: 12,
                border: `1px solid ${palette.border}`, background: palette.surface, color: palette.muted,
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}>Annuler</button>
              <button type="submit" disabled={saving} style={{
                flex: 2, padding: '13px 0', borderRadius: 12, border: 'none',
                background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
                color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                opacity: saving ? 0.7 : 1,
              }}>{saving ? '…' : 'Ajouter'}</button>
            </div>
          </form>
        </div>
      )}

      <TabBar active="repertoire" palette={palette} onNavigate={navigate} />
      <HomeIndicator palette={palette} />
    </div>
  )
}
