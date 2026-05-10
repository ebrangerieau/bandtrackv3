// morceau.jsx — Fiche morceau (vue complète scrollable)

function Morceau({ palette }) {
  const song = FOCUS_SONG;
  const [myLevel, setMyLevel] = React.useState(song.mine);
  const [status, setStatus] = React.useState(song.status);
  const [playing, setPlaying] = React.useState(false);
  const sliderRef = React.useRef(null);

  const levels = { ...song.levels, [ME.name]: myLevel };
  const avg = Object.values(levels).reduce((a, b) => a + b, 0) / Object.values(levels).length;

  const setLevelFromX = (clientX) => {
    if (!sliderRef.current) return;
    const r = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    setMyLevel(Math.round(pct * 10));
  };

  const onSliderDown = (e) => {
    e.preventDefault();
    setLevelFromX(e.clientX);
    const move = (ev) => setLevelFromX(ev.clientX);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const statusColor = STATUS[status].color;

  return (
    <Phone palette={palette}>
      <StatusBar palette={palette}/>

      {/* Back bar */}
      <div style={{
        position: 'absolute', top: 47, left: 0, right: 0, height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 30,
        background: alpha(palette.bg, 0.7),
        backdropFilter: 'blur(20px)',
      }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '8px 10px 8px 6px',
          background: 'transparent', border: 'none', color: palette.accent,
          fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          <svg width="11" height="16" viewBox="0 0 11 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L3 8l6 6"/></svg>
          Répertoire
        </button>
        <button style={{
          width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer',
          background: palette.surface2, color: palette.text,
          fontFamily: 'inherit', fontSize: 16, fontWeight: 700, lineHeight: 1,
          letterSpacing: 1.2,
        }}>···</button>
      </div>

      <div style={{
        position: 'absolute', top: 47 + 52, left: 0, right: 0, bottom: 110,
        overflowY: 'auto', padding: '6px 18px 16px', scrollbarWidth: 'none',
      }}>
        {/* En-tête */}
        <div style={{ marginBottom: 6 }}>
          <StatusPill status={status} dashed/>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, lineHeight: 1.05, marginTop: 8 }}>
          {song.title}
        </div>
        <div style={{ fontSize: 14, color: palette.muted, fontWeight: 500, marginTop: 4 }}>
          {song.author}
        </div>

        {/* Liens externes */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {[
            { label: 'YouTube', color: '#ff3535', icon: <svg width="13" height="9" viewBox="0 0 13 9" fill="currentColor"><path d="M12.7 1.4a1.6 1.6 0 0 0-1.1-1.1C10.6 0 6.5 0 6.5 0S2.4 0 1.4.3A1.6 1.6 0 0 0 .3 1.4C0 2.4 0 4.5 0 4.5s0 2 .3 3.1c.2.6.6 1 1.1 1.1 1 .3 5.1.3 5.1.3s4.1 0 5.1-.3a1.6 1.6 0 0 0 1.1-1.1c.3-1 .3-3.1.3-3.1s0-2-.3-3.1zM5.2 6.4V2.6l3.4 1.9-3.4 1.9z"/></svg> },
            { label: 'Spotify', color: '#1ed760', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-.9 7.4-.5 10.1 1.1.3.2.4.6.2 1zm1.2-2.7c-.2.3-.7.5-1 .3-2.8-1.7-7-2.2-10.3-1.2-.5.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.8-1.1 8.4-.6 11.6 1.4.3.2.4.7.1 1.1zm.1-2.8c-3.3-2-8.8-2.2-12-1.2-.5.2-1.1-.1-1.3-.7-.2-.6.1-1.1.7-1.3 3.7-1.1 9.7-.9 13.6 1.4.5.3.7 1 .4 1.5-.3.5-1 .7-1.4.4z"/></svg> },
          ].map((b) => (
            <button key={b.label} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
              border: `1px dashed ${alpha(b.color, 0.5)}`,
              background: alpha(b.color, 0.08),
              color: b.color, fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
            }}>
              {b.icon}
              {b.label}
            </button>
          ))}
        </div>

        {/* Niveau du groupe */}
        <Card palette={palette} style={{ marginTop: 16 }} padding={16}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: palette.muted, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>Niveau du groupe</span>
            <span>
              <span style={{ fontSize: 22, fontWeight: 800, color: palette.text, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5 }}>{avg.toFixed(1)}</span>
              <span style={{ fontSize: 12, color: palette.dim, fontWeight: 500, marginLeft: 3 }}>/ 10</span>
            </span>
          </div>
          <div style={{ height: 10, borderRadius: 6, background: alpha(palette.text, 0.06), overflow: 'hidden' }}>
            <div className="bt-bar-grow" style={{
              width: `${avg * 10}%`, height: '100%',
              background: 'linear-gradient(90deg, #ef4444 0%, #f97316 25%, #fbbf24 50%, #84cc16 75%, #22c55e 100%)',
              boxShadow: `0 0 14px ${alpha('#22c55e', 0.4)}`,
              transition: 'width 240ms ease',
            }}/>
          </div>

          <div className="bt-stagger" style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {MEMBERS.map((m) => {
              const v = levels[m.name] ?? 0;
              return (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={m.name} size={28} palette={palette} you={m.you} color={m.color}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5, fontWeight: m.you ? 700 : 600, color: m.you ? palette.accent : palette.text }}>{m.name}{m.you ? ' (moi)' : ''}</span>
                      {m.you && <span style={{ color: palette.accent2, fontSize: 11, lineHeight: 1 }}>★</span>}
                      <span style={{ marginLeft: 'auto', fontSize: 11.5, color: palette.muted, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{v} / 10</span>
                    </div>
                    <LevelBar value={v} palette={palette} height={4}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Mon niveau */}
        <Card palette={palette} accent={palette.accent} style={{ marginTop: 14 }} padding={16}>
          <div style={{ fontSize: 12, color: palette.accent, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            ◉ Mon niveau de maîtrise
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginTop: 12, gap: 4 }}>
            <span key={myLevel} className="bt-fadeup" style={{
              fontSize: 56, fontWeight: 800, lineHeight: 1, letterSpacing: -2.5,
              background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontVariantNumeric: 'tabular-nums',
            }}>{myLevel}</span>
            <span style={{ fontSize: 16, color: palette.dim, fontWeight: 600 }}>/ 10</span>
          </div>

          <div style={{ marginTop: 8, marginBottom: 6, padding: '0 4px' }}>
            <div ref={sliderRef} onPointerDown={onSliderDown} style={{
              position: 'relative', height: 28, cursor: 'pointer', userSelect: 'none', touchAction: 'none',
            }}>
              {/* Track */}
              <div style={{
                position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)',
                height: 8, borderRadius: 6,
                background: alpha(palette.text, 0.08),
              }}/>
              {/* Filled */}
              <div style={{
                position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)',
                width: `${myLevel * 10}%`, height: 8, borderRadius: 6,
                background: `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
                boxShadow: glow(palette.accent, 0.4, 10),
                transition: 'width 120ms ease',
              }}/>
              {/* Thumb */}
              <div className="bt-thumb-halo" style={{
                position: 'absolute', top: '50%', left: `${myLevel * 10}%`,
                transform: 'translate(-50%, -50%)',
                width: 24, height: 24, borderRadius: '50%',
                background: '#fff',
                boxShadow: `0 0 0 4px ${alpha(palette.accent, 0.25)}, 0 0 18px ${alpha(palette.accent, 0.6)}, 0 2px 6px ${alpha('#000', 0.5)}`,
                transition: 'left 120ms ease',
              }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10.5, color: palette.dim, fontWeight: 500 }}>
              <span>0 — Inconnu</span>
              <span>10 — Parfait</span>
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: STATUS.ready.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 11 }}>✓</span> Enregistré automatiquement
          </div>
        </Card>

        {/* Mes notes personnelles */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: palette.muted, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>
            Mes notes personnelles
          </div>
          <div style={{
            background: palette.surface, borderRadius: 14,
            border: `1px dashed ${palette.border}`, padding: 14,
            fontSize: 13, lineHeight: 1.5, color: palette.text,
            fontFamily: '"Caveat", "Bradley Hand", "Plus Jakarta Sans", sans-serif',
            fontSize: 16, fontWeight: 500,
          }}>
            {MY_NOTES}
          </div>

          {/* Audio note */}
          <div style={{
            marginTop: 8, display: 'flex', alignItems: 'center', gap: 10,
            background: palette.surface, borderRadius: 14, padding: '10px 12px',
            border: `1px solid ${palette.border}`,
          }}>
            <button onClick={() => setPlaying(!playing)} className={playing ? 'bt-glow-pulse' : ''} style={{
              width: 34, height: 34, borderRadius: '50%', border: 'none',
              background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: glow(palette.accent, 0.4, 10),
            }}>
              {playing ? (
                <svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor"><rect x="0" y="0" width="4" height="12" rx="1"/><rect x="7" y="0" width="4" height="12" rx="1"/></svg>
              ) : (
                <svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor"><path d="M0 0v12l11-6L0 0z"/></svg>
              )}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: palette.muted, fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              {playing && (
                <span className="bt-eq" style={{ color: palette.accent, height: 9 }}><i/><i/><i/><i/></span>
              )}
              Mémo audio · 0:42
            </div>
              <div style={{ height: 4, borderRadius: 2, background: alpha(palette.text, 0.08), overflow: 'hidden' }}>
                <div style={{ width: playing ? '38%' : '0%', height: '100%', background: palette.accent, transition: 'width 250ms linear' }}/>
              </div>
            </div>
            <span style={{ fontSize: 11, color: palette.dim, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {playing ? '0:16' : '0:00'}
            </span>
          </div>
        </div>

        {/* Note collective */}
        <Card palette={palette} accent={palette.accent3} style={{ marginTop: 16 }} padding={16}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: palette.accent3, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              ✦ Note du groupe
            </span>
            <button style={{
              padding: '4px 10px', borderRadius: 8, border: `1px solid ${alpha(palette.accent3, 0.4)}`,
              background: 'transparent', color: palette.accent3, fontSize: 11, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
            }}>✏ Modifier</button>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5, fontStyle: 'italic', color: palette.text }}>
            « {COLLECTIVE_NOTE.text} »
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: palette.muted, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Avatar name={COLLECTIVE_NOTE.author} size={18} palette={palette} color="#ec4899"/>
            <span style={{ fontWeight: 700, color: palette.text }}>{COLLECTIVE_NOTE.author}</span>
            · {COLLECTIVE_NOTE.time}
          </div>
        </Card>

        {/* Statut */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, color: palette.muted, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>
            Changer le statut
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Object.entries(STATUS).map(([k, v]) => {
              const on = k === status;
              return (
                <button key={k} onClick={() => setStatus(k)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '11px 12px', borderRadius: 12, cursor: 'pointer',
                  border: on ? `1px solid ${alpha(v.color, 0.5)}` : `1px dashed ${palette.border}`,
                  background: on ? alpha(v.color, 0.15) : palette.surface2,
                  color: on ? v.color : palette.muted,
                  fontFamily: 'inherit', fontSize: 12, fontWeight: on ? 700 : 600,
                  textAlign: 'left',
                  boxShadow: on ? glow(v.color, 0.2, 10) : 'none',
                  transition: 'all 200ms ease',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: v.color,
                    boxShadow: on ? `0 0 10px ${alpha(v.color, 0.9)}` : 'none', flexShrink: 0,
                  }}/>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Méta footer */}
        <div style={{ marginTop: 18, padding: '12px 0 0', borderTop: `1px solid ${palette.border}`, fontSize: 10.5, color: palette.dim, fontWeight: 500, lineHeight: 1.6 }}>
          Créé par <span style={{ color: palette.muted }}>Marc</span> · 12 mars<br/>
          Modifié par <span style={{ color: palette.muted }}>Léa</span> · il y a 2 j
        </div>
      </div>

      <TabBar active="rep" palette={palette} badge={3}/>
      <HomeIndicator palette={palette}/>
    </Phone>
  );
}

window.Morceau = Morceau;
