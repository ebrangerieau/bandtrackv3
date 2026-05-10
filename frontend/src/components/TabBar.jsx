import { alpha, glow } from '../theme.js'

const TABS = [
  { id: 'dashboard',   label: 'Accueil',     icon: 'home' },
  { id: 'repertoire',  label: 'Répertoire',  icon: 'music' },
  { id: 'prestations', label: 'Prestations', icon: 'mic' },
  { id: 'settings',    label: 'Réglages',    icon: 'gear' },
]

function TabIcon({ kind, active, color }) {
  const c = active ? color : 'currentColor'
  const sw = active ? 2.2 : 1.8
  switch (kind) {
    case 'home':
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></svg>
    case 'music':
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    case 'mic':
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg>
    case 'gear':
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>
    default: return null
  }
}

export default function TabBar({ active, palette, badge, onNavigate }) {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 16, right: 16, height: 64,
      background: alpha(palette.surface, 0.72),
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: `0.5px solid ${alpha(palette.border, 0.8)}`,
      borderRadius: 22,
      boxShadow: `0 12px 36px ${alpha('#000', 0.45)}, 0 0 0 0.5px ${alpha(palette.accent, 0.15)} inset`,
      display: 'flex', alignItems: 'stretch', padding: '0 4px',
      zIndex: 40,
    }}>
      {TABS.map((t) => {
        const on = t.id === active
        return (
          <div key={t.id}
            onClick={() => onNavigate && onNavigate(t.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, position: 'relative', cursor: 'pointer',
              color: on ? palette.accent : palette.dim,
              transition: 'color 200ms ease',
            }}>
            <div style={{ position: 'relative' }}>
              <TabIcon kind={t.icon} active={on} color={palette.accent} />
              {t.id === 'dashboard' && badge ? (
                <span className="bt-glow-pulse" style={{
                  position: 'absolute', top: -3, right: -6, minWidth: 16, height: 16,
                  padding: '0 4px', borderRadius: 8, background: palette.accent2,
                  color: '#fff', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: glow(palette.accent2, 0.5, 8),
                  border: `1.5px solid ${palette.surface}`,
                }}>{badge}</span>
              ) : null}
            </div>
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, letterSpacing: 0.1 }}>
              {t.label}
            </span>
            {on && (
              <span style={{
                position: 'absolute', bottom: 6, width: 18, height: 2,
                borderRadius: 2, background: palette.accent,
                boxShadow: glow(palette.accent, 0.6, 6),
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
