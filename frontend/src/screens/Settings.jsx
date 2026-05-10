import { useState, useEffect } from 'react'
import { alpha, glow, PALETTES } from '../theme.js'
import * as api from '../api.js'
import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'

export default function Settings({ palette, paletteKey, onPaletteChange, user, navigate, onLogout }) {
  const [groupName, setGroupName] = useState('')
  const [editingGroup, setEditingGroup] = useState(false)
  const [groupInput, setGroupInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getGroup().then(g => { setGroupName(g.name); setGroupInput(g.name) }).catch(console.error)
  }, [])

  const saveGroup = async () => {
    setSaving(true)
    try {
      const res = await api.updateGroup(groupInput.trim())
      setGroupName(res.name)
      setEditingGroup(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const row = (label, children) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: `1px solid ${alpha(palette.border, 0.5)}` }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: palette.text }}>{label}</span>
      {children}
    </div>
  )

  return (
    <div style={{ position: 'absolute', inset: 0, background: palette.bg, color: palette.text, fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      <StatusBar palette={palette} />
      <div className="bt-no-scroll" style={{ position: 'absolute', inset: 0, paddingTop: 47, paddingBottom: 110, overflowY: 'auto' }}>
        <div style={{ padding: '14px 20px 16px' }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1 }}>Réglages</div>
        </div>

        {/* Group */}
        <div style={{ margin: '0 20px 20px' }}>
          <div style={{ fontSize: 11, color: palette.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Groupe</div>
          <div style={{ background: palette.surface, borderRadius: 16, border: `1px solid ${palette.border}`, overflow: 'hidden' }}>
            {editingGroup ? (
              <div style={{ padding: 16 }}>
                <input
                  type="text" value={groupInput} onChange={e => setGroupInput(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${alpha(palette.accent, 0.4)}`,
                    background: palette.surface2, color: palette.text, fontSize: 14, outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => setEditingGroup(false)} style={{
                    flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${palette.border}`,
                    background: 'transparent', color: palette.muted, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>Annuler</button>
                  <button onClick={saveGroup} disabled={saving} style={{
                    flex: 2, padding: '10px 0', borderRadius: 10, border: 'none',
                    background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
                    color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1,
                  }}>{saving ? '…' : 'Enregistrer'}</button>
                </div>
              </div>
            ) : (
              <div onClick={() => setEditingGroup(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: palette.text }}>{groupName || '…'}</span>
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke={palette.dim} strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l5 5-5 5"/></svg>
              </div>
            )}
          </div>
        </div>

        {/* Palette */}
        <div style={{ margin: '0 20px 20px' }}>
          <div style={{ fontSize: 11, color: palette.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Ambiance visuelle</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {Object.entries(PALETTES).map(([key, p]) => {
              const on = key === paletteKey
              return (
                <button key={key} onClick={() => onPaletteChange(key)} style={{
                  padding: '14px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                  border: on ? `1px solid ${alpha(p.accent, 0.6)}` : `1px solid ${alpha(p.accent, 0.2)}`,
                  background: on ? `linear-gradient(135deg, ${alpha(p.accent, 0.2)}, ${alpha(p.accent2, 0.12)})` : p.surface,
                  boxShadow: on ? glow(p.accent, 0.3, 14) : 'none',
                  transition: 'all 200ms ease',
                }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                    {[p.accent, p.accent2, p.accent3].map((c, i) => (
                      <span key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${alpha(c, 0.6)}` }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: on ? 700 : 600, color: on ? p.text : alpha(p.text, 0.6) }}>{p.name}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Account */}
        <div style={{ margin: '0 20px 20px' }}>
          <div style={{ fontSize: 11, color: palette.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Compte</div>
          <div style={{ background: palette.surface, borderRadius: 16, border: `1px solid ${palette.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${alpha(palette.border, 0.5)}` }}>
              <div style={{ fontSize: 12, color: palette.muted, fontWeight: 500, marginBottom: 2 }}>Connecté en tant que</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{user.name}</div>
              {user.is_admin ? (
                <div style={{ marginTop: 4, fontSize: 11, color: palette.accent, fontWeight: 600 }}>★ Administrateur</div>
              ) : null}
            </div>
            <button onClick={onLogout} style={{
              width: '100%', padding: '14px 16px', border: 'none', background: 'transparent',
              color: '#ef4444', fontSize: 14, fontWeight: 700, cursor: 'pointer', textAlign: 'left',
            }}>
              Se déconnecter
            </button>
          </div>
        </div>

        {/* About */}
        <div style={{ margin: '0 20px', padding: '20px 0', textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, margin: '0 auto 10px',
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: glow(palette.accent, 0.4, 14),
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="#fff" stroke="none"/><circle cx="18" cy="16" r="3" fill="#fff" stroke="none"/>
            </svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: palette.text }}>BandTrack</div>
          <div style={{ fontSize: 12, color: palette.dim, marginTop: 4 }}>v3.0 · Stage Energy</div>
        </div>
      </div>

      <TabBar active="settings" palette={palette} onNavigate={navigate} />
      <HomeIndicator palette={palette} />
    </div>
  )
}
