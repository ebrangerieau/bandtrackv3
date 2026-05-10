// ui.jsx — shared BandTrack UI primitives (Phone, status bar, tab bar, cards, etc.)

const Phone = ({ children, palette }) => (
  <div style={{
    width: 390, height: 844, background: palette.bg, color: palette.text,
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    fontFeatureSettings: '"ss01"', position: 'relative', overflow: 'hidden',
    fontSize: 14, letterSpacing: -0.1,
  }}>
    {children}
  </div>
);

// iOS-style status bar
const StatusBar = ({ palette }) => (
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0, height: 47,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 28px 0 28px', fontSize: 15, fontWeight: 600, color: palette.text,
    zIndex: 50, pointerEvents: 'none',
  }}>
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>20:42</span>
    <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {/* signal */}
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
        <rect x="0" y="7" width="3" height="4" rx="0.5"/>
        <rect x="4.5" y="5" width="3" height="6" rx="0.5"/>
        <rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/>
        <rect x="13.5" y="0" width="3" height="11" rx="0.5"/>
      </svg>
      {/* wifi */}
      <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
        <path d="M7.5 2C4.4 2 1.7 3.2 0 5.1l1.4 1.4C2.7 4.9 4.9 4 7.5 4S12.3 4.9 13.6 6.5L15 5.1C13.3 3.2 10.6 2 7.5 2zm0 3C5.5 5 3.7 5.7 2.4 6.9l1.4 1.4C4.7 7.4 6 6.9 7.5 6.9s2.8.5 3.7 1.4l1.4-1.4C11.3 5.7 9.5 5 7.5 5zm0 3c-1.2 0-2.2.5-3 1.3L7.5 11l3-1.7c-.8-.8-1.8-1.3-3-1.3z"/>
      </svg>
      {/* battery */}
      <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
        <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" opacity="0.5"/>
        <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/>
        <rect x="24" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5"/>
      </svg>
    </span>
  </div>
);

const HomeIndicator = ({ palette }) => (
  <div style={{
    position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
    width: 134, height: 5, borderRadius: 3, background: palette.text, opacity: 0.7,
    zIndex: 50,
  }}/>
);

// Tab bar (4 tabs)
const TABS = [
  { id: 'home',  label: 'Accueil',     icon: 'home' },
  { id: 'rep',   label: 'Répertoire',  icon: 'music' },
  { id: 'gigs',  label: 'Prestations', icon: 'mic' },
  { id: 'set',   label: 'Réglages',    icon: 'gear' },
];

const TabIcon = ({ kind, active, color }) => {
  const c = active ? color : 'currentColor';
  const sw = active ? 2.2 : 1.8;
  switch (kind) {
    case 'home':
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></svg>;
    case 'music':
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case 'mic':
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg>;
    case 'gear':
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>;
  }
};

const TabBar = ({ active, palette, badge }) => (
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
      const on = t.id === active;
      return (
        <div key={t.id} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 3, position: 'relative',
          color: on ? palette.accent : palette.dim,
          transition: 'color 200ms ease',
        }}>
          <div style={{ position: 'relative' }}>
            <TabIcon kind={t.icon} active={on} color={palette.accent} />
            {t.id === 'home' && badge ? (
              <span className="bt-glow-pulse" style={{
                position: 'absolute', top: -3, right: -6, minWidth: 16, height: 16,
                padding: '0 4px',
                borderRadius: 8, background: palette.accent2,
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
            }}/>
          )}
        </div>
      );
    })}
  </div>
);

// Mini progress bar — colored by value (red→orange→green) when `mode='level'`,
// or solid `color` otherwise.
const LevelBar = ({ value, max = 10, height = 6, palette, mode = 'level', color }) => {
  const pct = Math.max(0, Math.min(1, value / max));
  let fill;
  if (mode === 'level') {
    // multi-stop gradient that the *width* slices into
    fill = 'linear-gradient(90deg, #ef4444 0%, #f97316 30%, #fbbf24 55%, #84cc16 78%, #22c55e 100%)';
  } else {
    fill = color || palette.accent;
  }
  return (
    <div style={{
      width: '100%', height, borderRadius: height,
      background: alpha(palette.text, 0.06), overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct * 100}%`, height: '100%',
        background: fill,
        borderRadius: height,
        boxShadow: mode === 'level' ? `0 0 8px ${alpha('#22c55e', 0.3 * pct)}` : 'none',
        transition: 'width 240ms ease',
      }}/>
    </div>
  );
};

// Avatar — initials in a colored disc, optional gradient (for "moi")
const Avatar = ({ name, size = 32, palette, you = false, color }) => {
  const initial = name ? name.trim()[0].toUpperCase() : '?';
  const bg = you
    ? `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`
    : (color || alpha(palette.text, 0.1));
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.42,
      color: you ? '#fff' : palette.text,
      flexShrink: 0,
      boxShadow: you ? glow(palette.accent, 0.45, 12) : 'none',
      border: you ? 'none' : `1px solid ${alpha(palette.text, 0.08)}`,
    }}>{initial}</div>
  );
};

// Status pill with 4 visual variants
const StatusPill = ({ status, size = 'md', dashed = false }) => {
  const s = STATUS[status];
  const { color } = s;
  const small = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: small ? '3px 8px' : '5px 11px',
      borderRadius: 999,
      background: alpha(color, dashed ? 0.06 : 0.15),
      color, fontSize: small ? 10.5 : 12, fontWeight: 700,
      letterSpacing: 0.2, textTransform: 'uppercase',
      border: dashed ? `1px dashed ${alpha(color, 0.5)}` : `1px solid ${alpha(color, 0.3)}`,
    }}>
      <span className="bt-dot-pulse" style={{
        width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: '50%', background: color,
        boxShadow: `0 0 6px ${alpha(color, 0.8)}`,
      }}/>
      {small ? s.short : s.label}
    </span>
  );
};

// Chip (small inline label)
const Chip = ({ children, color, palette, icon }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 9px', borderRadius: 999,
    background: alpha(color, 0.12),
    color, fontSize: 11.5, fontWeight: 600,
    border: `1px solid ${alpha(color, 0.25)}`,
    letterSpacing: 0.1,
  }}>
    {icon ? <span style={{ fontSize: 11 }}>{icon}</span> : null}
    {children}
  </span>
);

// Generic card (surface + border, no shadow)
const Card = ({ children, palette, accent, style = {}, padding = 14 }) => (
  <div style={{
    background: palette.surface, borderRadius: 16, padding,
    border: `1px solid ${alpha(accent || palette.border, accent ? 0.35 : 1)}`,
    boxShadow: accent ? glow(accent, 0.18, 18) : 'none',
    ...style,
  }}>{children}</div>
);

Object.assign(window, {
  Phone, StatusBar, HomeIndicator, TabBar, TABS, TabIcon,
  LevelBar, Avatar, StatusPill, Chip, Card,
});
