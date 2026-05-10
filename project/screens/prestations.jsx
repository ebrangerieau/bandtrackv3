// prestations.jsx — Liste des prestations (à venir / passées)

function Prestations({ palette }) {
  const upcoming = GIGS.filter((g) => g.when === 'à venir');
  const past = GIGS.filter((g) => g.when === 'passée');
  const [tab, setTab] = React.useState('upcoming');
  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <Phone palette={palette}>
      <StatusBar palette={palette}/>

      <div style={{ position: 'absolute', inset: 0, paddingTop: 47, paddingBottom: 110, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '14px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: palette.muted, fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              {upcoming.length} à venir · {past.length} passées
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1 }}>Prestations</div>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
            color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: glow(palette.accent, 0.45, 14),
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M7 2v10M2 7h10"/></svg>
            Nouvelle
          </button>
        </div>

        {/* Tab segment */}
        <div style={{ padding: '4px 20px 12px' }}>
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
            }}/>
            {[
              { id: 'upcoming', label: 'À venir',  count: upcoming.length },
              { id: 'past',     label: 'Passées',  count: past.length },
            ].map((t) => {
              const on = t.id === tab;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, position: 'relative', zIndex: 1,
                  padding: '10px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                  color: on ? palette.text : palette.muted, fontFamily: 'inherit',
                  fontSize: 13, fontWeight: 700, letterSpacing: -0.1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}>
                  {t.label}
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
                    background: on ? alpha(palette.accent, 0.3) : alpha(palette.text, 0.06),
                    color: on ? palette.accent : palette.dim,
                  }}>{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gig list */}
        <div key={tab} className="bt-stagger" style={{ flex: 1, overflowY: 'auto', padding: '0 18px 8px', display: 'flex', flexDirection: 'column', gap: 11, scrollbarWidth: 'none' }}>
          {list.map((g, i) => {
            const isNext = tab === 'upcoming' && i === 0;
            const completion = Math.round((g.ready / g.setlist) * 100);
            const completionColor = completion >= 80 ? STATUS.ready.color
                                  : completion >= 50 ? '#fbbf24'
                                  : '#f97316';
            return (
              <div key={g.id} style={{
                position: 'relative', borderRadius: 18, padding: '14px 16px',
                background: isNext
                  ? `linear-gradient(135deg, ${alpha(palette.accent, 0.18)} 0%, ${alpha(palette.accent2, 0.06)} 60%, ${palette.surface} 100%)`
                  : palette.surface,
                border: isNext
                  ? `1px solid ${alpha(palette.accent, 0.4)}`
                  : `1px solid ${palette.border}`,
                boxShadow: isNext ? `0 0 26px ${alpha(palette.accent, 0.18)}` : 'none',
                opacity: tab === 'past' ? 0.85 : 1,
                overflow: 'hidden',
              }}>
                {isNext && (
                  <div style={{
                    position: 'absolute', top: -28, right: -28, width: 110, height: 110,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(palette.accent2, 0.4)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}/>
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
                    <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, marginTop: 2, letterSpacing: -0.7, color: palette.text, fontVariantNumeric: 'tabular-nums' }}>{g.date.split(' ')[0]}</span>
                    <span style={{ fontSize: 10, color: palette.muted, fontWeight: 600, marginTop: 1 }}>{g.date.split(' ')[1]}</span>
                  </div>

                  {/* Right side */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isNext && (
                      <div className="bt-shimmer-text" style={{
                        display: 'inline-block', fontSize: 9.5, fontWeight: 800,
                        color: palette.accent, letterSpacing: 1.2, textTransform: 'uppercase',
                        marginBottom: 4,
                      }}>▶ Prochain</div>
                    )}
                    <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.2 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: palette.muted, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>📍</span>{g.place}
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 10 }}>
                      <span style={{ fontSize: 11.5, color: palette.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        ♪ <span style={{ color: palette.text, fontWeight: 700 }}>{g.setlist}</span> morc.
                      </span>
                      <span style={{ width: 1, height: 11, background: palette.border }}/>
                      <span style={{ fontSize: 11.5, color: palette.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        ⏱ <span style={{ color: palette.text, fontWeight: 700 }}>{g.duration}</span>′
                      </span>
                      {tab === 'upcoming' && (
                        <span style={{ marginLeft: 'auto' }}>
                          <Chip color={palette.accent2} palette={palette}>J−{g.dDay}</Chip>
                        </span>
                      )}
                    </div>

                    {/* Completion bar */}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: palette.muted, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                          Setlist prête
                        </span>
                        <span style={{ fontSize: 11, color: completionColor, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                          {g.ready}/{g.setlist} · {completion}%
                        </span>
                      </div>
                      <div style={{ height: 4, borderRadius: 4, background: alpha(palette.text, 0.06), overflow: 'hidden' }}>
                        <div className="bt-bar-grow" style={{
                          width: `${completion}%`, height: '100%', borderRadius: 4,
                          background: completionColor,
                          boxShadow: `0 0 8px ${alpha(completionColor, 0.5)}`,
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {tab === 'past' && (
            <div style={{ padding: '14px 4px 0', textAlign: 'center', fontSize: 11, color: palette.dim, fontWeight: 500 }}>
              Fin de l'historique
            </div>
          )}
        </div>

      </div>

      <TabBar active="gigs" palette={palette} badge={3}/>
      <HomeIndicator palette={palette}/>
    </Phone>
  );
}

window.Prestations = Prestations;
