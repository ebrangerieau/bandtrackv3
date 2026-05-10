// dashboard.jsx — Tableau de bord ("Stage Energy")

function Dashboard({ palette }) {
  const next = NEXT_GIG;
  const learning = SONGS.filter((s) => s.status === 'learning');
  const ready = SONGS.filter((s) => s.status === 'ready');
  const ideas = SONGS.filter((s) => s.status === 'suggestion');

  return (
    <Phone palette={palette}>
      <StatusBar palette={palette}/>

      <div style={{
        position: 'absolute', inset: 0, paddingTop: 47, paddingBottom: 110,
        overflow: 'hidden',
      }}>
        {/* Background flare */}
        <div className="bt-orb" style={{
          position: 'absolute', top: -60, right: -80, width: 320, height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(palette.accent, 0.22)} 0%, ${alpha(palette.accent2, 0.05)} 50%, transparent 70%)`,
          pointerEvents: 'none', filter: 'blur(8px)',
        }}/>

        {/* Header */}
        <div style={{
          padding: '14px 20px 10px', display: 'flex', alignItems: 'center', gap: 12,
          position: 'relative',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: glow(palette.accent, 0.5, 16),
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="#fff"/><circle cx="18" cy="16" r="3" fill="#fff"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: palette.muted, fontWeight: 500, letterSpacing: 0.3, textTransform: 'uppercase' }}>{GROUP}</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>
              Bonjour {ME.name} <span style={{ display: 'inline-block', transform: 'rotate(15deg)' }}>👋</span>
            </div>
          </div>
          <button style={{
            position: 'relative', width: 40, height: 40, borderRadius: 12, border: 'none',
            background: alpha(palette.surface2, 0.8),
            border: `1px solid ${palette.border}`,
            color: palette.text, cursor: 'pointer',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>
            </svg>
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 9, height: 9, borderRadius: '50%',
              background: palette.accent2, boxShadow: glow(palette.accent2, 0.7, 6),
              border: `1.5px solid ${palette.surface}`,
            }}/>
          </button>
        </div>

        <div style={{ padding: '6px 20px 0', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
          {/* HERO — Prochain concert */}
          <div style={{
            position: 'relative', borderRadius: 22, padding: 18,
            background: `linear-gradient(140deg, ${alpha(palette.accent, 0.18)} 0%, ${alpha(palette.accent2, 0.08)} 60%, ${alpha(palette.surface, 0.6)} 100%), ${palette.surface}`,
            border: `1px solid ${alpha(palette.accent, 0.35)}`,
            boxShadow: `0 0 30px ${alpha(palette.accent, 0.18)}, 0 12px 32px ${alpha('#000', 0.4)}`,
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20, width: 110, height: 110,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(palette.accent2, 0.5)} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}/>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <span className="bt-shimmer-text" style={{ fontSize: 10, fontWeight: 700, color: palette.accent, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                ▶ Prochain concert
              </span>
              <div style={{
                padding: '6px 12px', borderRadius: 10,
                border: `1px solid ${alpha(palette.accent, 0.5)}`,
                background: alpha(palette.bg, 0.5),
                fontSize: 12, fontWeight: 700, color: palette.text,
                fontVariantNumeric: 'tabular-nums', letterSpacing: 0.2,
              }}>
                {next.weekday} {next.date}
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 25, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1, position: 'relative' }}>
              {next.name}
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: palette.muted, fontWeight: 500, position: 'relative' }}>
              📍 {next.place}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14, position: 'relative' }}>
              <Chip color={palette.accent3} palette={palette}>♪ {next.setlist} morceaux</Chip>
              <Chip color="#fbbf24" palette={palette}>⏱ {next.duration} min</Chip>
              <Chip color={palette.accent2} palette={palette}>J−{next.dDay}</Chip>
            </div>
          </div>

          {/* Stats pills */}
          <div className="bt-stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { n: learning.length, label: 'En cours', color: STATUS.learning.color },
              { n: ready.length,    label: 'Prêts',    color: STATUS.ready.color },
              { n: ideas.length,    label: 'Idées',    color: STATUS.suggestion.color },
            ].map((s) => (
              <div key={s.label} style={{
                background: palette.surface, borderRadius: 16, padding: '12px 12px 11px',
                border: `1px solid ${palette.border}`,
                position: 'relative', overflow: 'hidden',
              }}>
                <span style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: s.color, opacity: 0.8,
                  boxShadow: `0 0 8px ${alpha(s.color, 0.7)}`,
                }}/>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: -1, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.n}</div>
                <div style={{ fontSize: 11, color: palette.muted, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Morceaux en cours */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 9 }}>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>Morceaux en cours</span>
              <span style={{ fontSize: 12, color: palette.accent, fontWeight: 600 }}>Voir tout →</span>
            </div>
            <div className="bt-stagger" style={{ display: 'flex', gap: 9, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
              {learning.slice(0, 4).map((s) => {
                const avg = avgLevel(s);
                return (
                  <div key={s.id} style={{
                    flex: '0 0 auto', width: 140, height: 92,
                    background: palette.surface, borderRadius: 14,
                    border: `1px solid ${palette.border}`,
                    padding: '10px 12px', position: 'relative', overflow: 'hidden',
                  }}>
                    <span className="bt-bar-grow" style={{
                      position: 'absolute', top: 0, left: 0, width: `${avg * 10}%`, height: 3,
                      background: 'linear-gradient(90deg, #ef4444, #f97316, #fbbf24, #22c55e)',
                      transition: 'width 240ms ease',
                    }}/>
                    <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: palette.muted, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.author}</div>
                    <div style={{ position: 'absolute', bottom: 8, left: 12, right: 12, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: palette.text, letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums' }}>{avg.toFixed(1)}</span>
                      <span style={{ fontSize: 9, color: palette.dim, fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase' }}>/ 10</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activité récente */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2, marginBottom: 8 }}>Activité récente</div>
            <div style={{
              background: palette.surface, borderRadius: 16,
              border: `1px solid ${palette.border}`, overflow: 'hidden',
            }}>
              {ACTIVITY.slice(0, 4).map((a, i) => {
                const dotColor = a.type === 'accent'  ? palette.accent
                              : a.type === 'accent3' ? palette.accent3
                              : STATUS[a.type]?.color;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    borderTop: i ? `1px solid ${alpha(palette.border, 0.6)}` : 'none',
                  }}>
                    <span className={i === 0 ? 'bt-dot-pulse' : ''} style={{
                      width: 7, height: 7, borderRadius: '50%', background: dotColor,
                      boxShadow: `0 0 8px ${alpha(dotColor, 0.8)}`, flexShrink: 0,
                    }}/>
                    <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.35, minWidth: 0 }}>
                      <span style={{ fontWeight: 700 }}>{a.who}</span>{' '}
                      <span style={{ color: palette.muted }}>{a.text}</span>
                    </div>
                    <span style={{ fontSize: 10.5, color: palette.dim, fontWeight: 500, flexShrink: 0 }}>{a.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <TabBar active="home" palette={palette} badge={3}/>
      <HomeIndicator palette={palette}/>
    </Phone>
  );
}

window.Dashboard = Dashboard;
