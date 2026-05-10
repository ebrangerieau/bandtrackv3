import { useState, useEffect } from 'react'
import { alpha, glow, STATUS } from '../theme.js'
import * as api from '../api.js'
import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import Chip from '../components/Chip.jsx'

export default function Prestations({ palette, user, navigate }) {
  const [gigs, setGigs] = useState([])
  const [tab, setTab] = useState('upcoming')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addName, setAddName] = useState('')
  const [addDate, setAddDate] = useState('')
  const [addPlace, setAddPlace] = useState('')
  const [addDuration, setAddDuration] = useState('60')
  const [addError, setAddError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadGigs = () => {
    api.getGigs()
      .then(g => { setGigs(g); setLoading(false) })
      .catch(console.error)
  }

  useEffect(() => { loadGigs() }, [])

  const upcoming = gigs.filter(g => g.when === 'à venir').sort((a, b) => a.dday - b.dday)
  const past = gigs.filter(g => g.when === 'passée').sort((a, b) => b.dday - a.dday)
  const list = tab === 'upcoming' ? upcoming : past

  const handleAdd = async (e) => {
    e.preventDefault()
    setAddError('')
    if (!addName.trim() || !addDate || !addPlace.trim()) { setAddError('Nom, date et lieu requis'); return }
    setSaving(true)
    try {
      await api.createGig({ name: addName.trim(), date: addDate, place: addPlace.trim(), duration: parseInt(addDuration) || 60 })
      setShowAdd(false)
      setAddName(''); setAddDate(''); setAddPlace(''); setAddDuration('60')
      loadGigs()
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
        <div style={{ padding: '14px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: palette.muted, fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              {upcoming.length} à venir · {past.length} passées
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1 }}>Prestations</div>
          </div>
          <button onClick={() => setShowAdd(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
            color: '#fff', fontSize: 13, fontWeight: 700,
            boxShadow: glow(palette.accent, 0.45, 14),
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M7 2v10M2 7h10"/></svg>
            Nouvelle
          </button>
        </div>

        {/* Segment tabs */}
        <div style={{ padding: '4px 20px 12px', flexShrink: 0 }}>
          <div style={{
            display: 'flex', padding: 3, borderRadius: 12,
            background: palette.surface, border: `1px solid ${palette.border}`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 3, bottom: 3,
              left: tab === 'upcoming' ? 3 : 'calc(50% + 0px)',
              width: 'calc(50% - 3px)',
              background: `linear-gradient(135deg, ${alpha(palette.accent, 0.25)}, ${alpha(palette.accent2, 0.18)})`,
              border: `1px solid ${alpha(palette.accent, 0.4)}`,
              borderRadius: 10,
              transition: 'left 200ms cubic-bezier(.3,.7,.4,1)',
              boxShadow: glow(palette.accent, 0.25, 12),
            }} />
            {[
              { id: 'upcoming', label: 'À venir',  count: upcoming.length },
              { id: 'past',     label: 'Passées',  count: past.length },
            ].map(t => {
              const on = t.id === tab
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, position: 'relative', zIndex: 1,
                  padding: '10px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                  color: on ? palette.text : palette.muted, fontSize: 13, fontWeight: 700,
                  letterSpacing: -0.1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}>
                  {t.label}
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
                    background: on ? alpha(palette.accent, 0.3) : alpha(palette.text, 0.06),
                    color: on ? palette.accent : palette.dim,
                  }}>{t.count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Gig list */}
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.muted }}>Chargement…</div>
        ) : (
          <div key={tab} className="bt-stagger bt-no-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 18px 8px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {list.map((g, i) => {
              const isNext = tab === 'upcoming' && i === 0
              const completion = g.setlist_count > 0 ? Math.round((g.ready_count / g.setlist_count) * 100) : 0
              const completionColor = completion >= 80 ? STATUS.ready.color
                                   : completion >= 50 ? '#fbbf24' : '#f97316'
              return (
                <div key={g.id} style={{
                  position: 'relative', borderRadius: 18, padding: '14px 16px',
                  background: isNext
                    ? `linear-gradient(135deg, ${alpha(palette.accent, 0.18)} 0%, ${alpha(palette.accent2, 0.06)} 60%, ${palette.surface} 100%)`
                    : palette.surface,
                  border: isNext ? `1px solid ${alpha(palette.accent, 0.4)}` : `1px solid ${palette.border}`,
                  boxShadow: isNext ? `0 0 26px ${alpha(palette.accent, 0.18)}` : 'none',
                  opacity: tab === 'past' ? 0.85 : 1,
                  overflow: 'hidden',
                }}>
                  {isNext && (
                    <div style={{
                      position: 'absolute', top: -28, right: -28, width: 110, height: 110, borderRadius: '50%',
                      background: `radial-gradient(circle, ${alpha(palette.accent2, 0.4)} 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }} />
                  )}
                  <div style={{ display: 'flex', gap: 14, position: 'relative' }}>
                    {/* Date block */}
                    <div style={{
                      flexShrink: 0, width: 60, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '8px 0', borderRadius: 12,
                      background: isNext ? alpha(palette.bg, 0.4) : palette.surface2,
                      border: isNext ? `1px solid ${alpha(palette.accent, 0.4)}` : `1px solid ${palette.border}`,
                    }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: isNext ? palette.accent : palette.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>{g.weekday}</span>
                      <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, marginTop: 2, letterSpacing: -0.7, fontVariantNumeric: 'tabular-nums' }}>{g.display.split(' ')[0]}</span>
                      <span style={{ fontSize: 10, color: palette.muted, fontWeight: 600, marginTop: 1 }}>{g.display.split(' ')[1]}</span>
                    </div>

                    {/* Right side */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {isNext && (
                        <div className="bt-shimmer-text" style={{
                          display: 'inline-block', fontSize: 9.5, fontWeight: 800,
                          color: palette.accent, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4,
                        }}>▶ Prochain</div>
                      )}
                      <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.2 }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: palette.muted, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>📍</span>{g.place}
                      </div>

                      {/* Stats row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 10 }}>
                        <span style={{ fontSize: 11.5, color: palette.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          ♪ <span style={{ color: palette.text, fontWeight: 700 }}>{g.setlist_count}</span> morc.
                        </span>
                        <span style={{ width: 1, height: 11, background: palette.border }} />
                        <span style={{ fontSize: 11.5, color: palette.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          ⏱ <span style={{ color: palette.text, fontWeight: 700 }}>{g.duration}</span>′
                        </span>
                        {tab === 'upcoming' && g.dday >= 0 && (
                          <span style={{ marginLeft: 'auto' }}>
                            <Chip color={palette.accent2}>J−{g.dday}</Chip>
                          </span>
                        )}
                      </div>

                      {/* Completion bar */}
                      {g.setlist_count > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: palette.muted, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>Setlist prête</span>
                            <span style={{ fontSize: 11, color: completionColor, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                              {g.ready_count}/{g.setlist_count} · {completion}%
                            </span>
                          </div>
                          <div style={{ height: 4, borderRadius: 4, background: alpha(palette.text, 0.06), overflow: 'hidden' }}>
                            <div className="bt-bar-grow" style={{
                              width: `${completion}%`, height: '100%', borderRadius: 4,
                              background: completionColor, boxShadow: `0 0 8px ${alpha(completionColor, 0.5)}`,
                            }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {list.length === 0 && (
              <div style={{ marginTop: 40, textAlign: 'center', color: palette.dim, fontSize: 13 }}>
                <div style={{ fontSize: 38, marginBottom: 8 }}>{tab === 'upcoming' ? '🗓️' : '📆'}</div>
                {tab === 'upcoming' ? 'Aucune prestation à venir' : "Pas d'historique"}
              </div>
            )}
            {tab === 'past' && past.length > 0 && (
              <div style={{ padding: '14px 4px 0', textAlign: 'center', fontSize: 11, color: palette.dim, fontWeight: 500 }}>
                Fin de l'historique
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add gig modal */}
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
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.4, marginBottom: 16 }}>Nouvelle prestation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="text" placeholder="Nom de la prestation" value={addName} onChange={e => setAddName(e.target.value)} style={inputStyle} />
              <input type="date" value={addDate} onChange={e => setAddDate(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
              <input type="text" placeholder="Lieu" value={addPlace} onChange={e => setAddPlace(e.target.value)} style={inputStyle} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ fontSize: 13, color: palette.muted, fontWeight: 500, flexShrink: 0 }}>Durée (min)</label>
                <input type="number" min="15" max="300" value={addDuration} onChange={e => setAddDuration(e.target.value)} style={{ ...inputStyle, width: 'auto', flex: 1 }} />
              </div>
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
              }}>{saving ? '…' : 'Créer'}</button>
            </div>
          </form>
        </div>
      )}

      <TabBar active="prestations" palette={palette} onNavigate={navigate} />
      <HomeIndicator palette={palette} />
    </div>
  )
}
