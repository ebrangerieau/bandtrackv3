// app.jsx — BandTrack design canvas + tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "violet",
  "showLabels": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = PALETTES[t.palette] || PALETTES.violet;

  // Inject root background once so the canvas grid bg gets a dark warm
  // surround that suits the dark mockups.
  React.useEffect(() => {
    document.body.style.background = '#0e0e16';
  }, []);

  // Override design-canvas grid color to a dark-friendly tone
  React.useEffect(() => {
    const id = 'dc-dark-bg';
    let s = document.getElementById(id);
    if (!s) { s = document.createElement('style'); s.id = id; document.head.appendChild(s); }
    s.textContent = `
      .design-canvas { background: #0e0e16 !important; }
      .design-canvas > div > div:first-child {
        background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent('rgba(255,255,255,0.04)')}' stroke-width='1'/%3E%3C/svg%3E") !important;
      }
      .dc-editable, .dc-labeltext, .dc-grip, .dc-kebab, .dc-expand {
        color: rgba(232,232,248,0.6) !important;
      }
      .dc-editable:focus { background: rgba(255,255,255,0.08) !important; box-shadow: 0 0 0 1.5px ${palette.accent} !important; }
      .dc-labeltext:hover { background: rgba(255,255,255,0.05) !important; }
      .dc-grip:hover, .dc-kebab:hover, .dc-expand:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
      .dc-sectionhead .dc-editable { color: rgba(232,232,248,0.92) !important; }
    `;
  }, [palette]);

  return (
    <>
      <DesignCanvas>
        <DCSection id="screens" title="BandTrack — Stage Energy" subtitle={`Mobile (390 × 844)  ·  Palette : ${palette.name}`}>
          <DCArtboard id="dashboard"   label="01 · Tableau de bord"  width={390} height={844}>
            <Dashboard palette={palette}/>
          </DCArtboard>
          <DCArtboard id="repertoire"  label="02 · Répertoire"       width={390} height={844}>
            <Repertoire palette={palette}/>
          </DCArtboard>
          <DCArtboard id="morceau"     label="03 · Fiche morceau"    width={390} height={844}>
            <Morceau palette={palette}/>
          </DCArtboard>
          <DCArtboard id="prestations" label="04 · Prestations"      width={390} height={844}>
            <Prestations palette={palette}/>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakColor
            label="Ambiance"
            value={t.palette}
            options={[
              { value: 'violet', colors: [PALETTES.violet.accent, PALETTES.violet.accent2, PALETTES.violet.accent3] },
              { value: 'rouge',  colors: [PALETTES.rouge.accent,  PALETTES.rouge.accent2,  PALETTES.rouge.accent3]  },
              { value: 'vert',   colors: [PALETTES.vert.accent,   PALETTES.vert.accent2,   PALETTES.vert.accent3]   },
              { value: 'bleu',   colors: [PALETTES.bleu.accent,   PALETTES.bleu.accent2,   PALETTES.bleu.accent3]   },
            ].map((o) => o.colors)}
            onChange={(arr) => {
              // map back from color triplet to palette key
              const k = Object.keys(PALETTES).find((k) => PALETTES[k].accent === arr[0]);
              if (k) setTweak('palette', k);
            }}
          />
          <TweakRadio
            label="Nom"
            value={t.palette}
            options={[
              { value: 'violet', label: 'Violet' },
              { value: 'rouge',  label: 'Rouge'  },
              { value: 'vert',   label: 'Vert'   },
              { value: 'bleu',   label: 'Bleu'   },
            ]}
            onChange={(v) => setTweak('palette', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
