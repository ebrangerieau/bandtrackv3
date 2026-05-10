// repertoire.jsx — Répertoire avec onglets par statut

function Repertoire({ palette }) {
  const [active, setActive] = React.useState('learning');
  const TABS_LIST = [
    { id: 'learning',   label: 'En cours',  icon: '📚', count: SONGS.filter((s) => s.status === 'learning').length },
    { id: 'ready',      label: 'Prêts',     icon: '✅', count: SONGS.filter((s) => s.status === 'ready').length },
    { id: 'suggestion', label: 'Idées',     icon: '💡', count: SONGS.filter((s) => s.status === 'suggestion').length },
    { id: 'archived',   label: 'Archivés',  icon: '📦', count: SONGS.filter((s) => s.status === 'archived').length },
  ];
  const songs = SONGS.filter((s) => s.status === active);
  const activeColor = STATUS[active].color;

  return (
    <Phone palette={palette}>
      <StatusBar palette={palette}/>

      <div style={{ position: 'absolute', inset: 0, paddingTop: 47, paddingBottom: 110, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '14px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: palette.muted, fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase' }}>{SONGS.filter((s) => s.status !== 'archived').length} morceaux</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1 }}>Répertoire</div>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
            color: '#fff', fontSize: 13, fontWeight: 700,
            fontFamily: 'inherit',
            boxShadow: glow(palette.accent, 0.45, 14),
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M7 2v10M2 7h10"/></svg>
            Ajouter
          </button>
        </div>

        {/* Tabs (pills) */}
        <div style={{ display: 'flex', gap: 7, padding: '4px 20px 8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS_LIST.map((t) => {
            const on = t.id === active;
            const c = STATUS[t.id].color;
            return (
              <button key={t.id} onClick={() => setActive(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 13px', borderRadius: 999, cursor: 'pointer',
                border: on ? `1px solid ${alpha(c, 0.5)}` : `1px solid ${palette.border}`,
                background: on ? alpha(c, 0.15) : palette.surface,
                color: on ? c : palette.muted,
                fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700,
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
                }}>{t.count}</span>
              </button>
            );
          })}
        </div>

        {/* Filter bar */}
        <div style={{ padding: '4px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 12px', borderRadius: 10,
            background: palette.surface, border: `1px solid ${palette.border}`,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={palette.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/></svg>
            <span style={{ fontSize: 12, color: palette.dim }}>Rechercher un morceau…</span>
          </div>
          <button style={{
            marginLeft: 8, width: 34, height: 34, borderRadius: 10,
            background: palette.surface, border: `1px solid ${palette.border}`,
            color: palette.muted, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
          </button>
        </div>

        {/* Song list */}
        <div key={active} className="bt-stagger" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 8px', display: 'flex', flexDirection: 'column', gap: 8, scrollbarWidth: 'none' }}>
          {songs.map((s) => {
            const avg = avgLevel(s);
            const c = STATUS[s.status].color;
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 10, borderRadius: 14,
                background: palette.surface,
                border: `1px solid ${palette.border}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: `linear-gradient(135deg, ${alpha(c, 0.85)}, ${alpha(c, 0.55)})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: glow(c, 0.3, 10),
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="#fff"/><circle cx="18" cy="16" r="3" fill="#fff"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: -0.2 }}>{s.title}</div>
                  <div style={{ fontSize: 11.5, color: palette.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{s.author}</div>
                </div>
                {avg > 0 && (
                  <div style={{ width: 56, flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: palette.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{avg.toFixed(1)}</div>
                    <LevelBar value={avg} palette={palette} height={4}/>
                  </div>
                )}
                {avg === 0 && (
                  <div style={{ fontSize: 11, color: palette.dim, fontWeight: 600, fontStyle: 'italic' }}>nouveau</div>
                )}
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke={palette.dim} strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M2 2l5 5-5 5"/></svg>
              </div>
            );
          })}
          {songs.length === 0 && (
            <div style={{ marginTop: 40, textAlign: 'center', color: palette.dim, fontSize: 13 }}>
              <div style={{ fontSize: 38, marginBottom: 8 }}>📭</div>
              Aucun morceau dans cette catégorie
            </div>
          )}
        </div>

      </div>

      <TabBar active="rep" palette={palette} badge={3}/>
      <HomeIndicator palette={palette}/>
    </Phone>
  );
}

window.Repertoire = Repertoire;
