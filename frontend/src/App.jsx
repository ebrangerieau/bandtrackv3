import { useState, useEffect, useCallback } from 'react'
import { PALETTES } from './theme.js'
import * as api from './api.js'
import Login from './screens/Login.jsx'
import Dashboard from './screens/Dashboard.jsx'
import Repertoire from './screens/Repertoire.jsx'
import Morceau from './screens/Morceau.jsx'
import Prestations from './screens/Prestations.jsx'
import Settings from './screens/Settings.jsx'

function useViewport() {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return vp
}

export default function App() {
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)
  const [screen, setScreen] = useState('dashboard')
  const [activeSongId, setActiveSongId] = useState(null)
  const [paletteKey, setPaletteKey] = useState(() => localStorage.getItem('bt-palette') || 'violet')
  const palette = PALETTES[paletteKey] || PALETTES.violet
  const vp = useViewport()

  useEffect(() => {
    api.getMe()
      .then(u => setUser(u))
      .catch(() => {})
      .finally(() => setBooting(false))
  }, [])

  const navigate = useCallback((target, opts = {}) => {
    if (target === 'morceau' && opts.songId) setActiveSongId(opts.songId)
    setScreen(target)
  }, [])

  const handleLogin = (u) => { setUser(u); setScreen('dashboard') }

  const handleLogout = () => {
    api.logout().catch(() => {})
    setUser(null)
    setScreen('dashboard')
  }

  const handlePaletteChange = (key) => {
    setPaletteKey(key)
    localStorage.setItem('bt-palette', key)
  }

  if (booting) {
    return <div style={{ background: '#0a0a14', height: '100vh' }} />
  }

  // Container: full viewport on mobile, centered phone frame on desktop
  const isMobile = vp.w <= 480
  const frameW = isMobile ? vp.w : 390
  const frameH = isMobile ? vp.h : Math.min(844, vp.h - 32)

  const outerStyle = {
    width: '100vw', height: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: isMobile ? palette.bg : '#0a0a14',
  }

  const innerStyle = {
    width: frameW, height: frameH,
    position: 'relative', overflow: 'hidden',
    background: palette.bg,
    borderRadius: isMobile ? 0 : 48,
    boxShadow: isMobile ? 'none' : '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
  }

  const screenProps = { palette, user, navigate }

  if (!user) {
    return (
      <div style={outerStyle}>
        <div style={innerStyle}>
          <Login palette={palette} onLogin={handleLogin} />
        </div>
      </div>
    )
  }

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        {screen === 'dashboard' && <Dashboard {...screenProps} />}
        {screen === 'repertoire' && (
          <Repertoire {...screenProps} onSongTap={(id) => navigate('morceau', { songId: id })} />
        )}
        {screen === 'morceau' && <Morceau {...screenProps} songId={activeSongId} />}
        {screen === 'prestations' && <Prestations {...screenProps} />}
        {screen === 'settings' && (
          <Settings {...screenProps} paletteKey={paletteKey}
            onPaletteChange={handlePaletteChange} onLogout={handleLogout} />
        )}
      </div>
    </div>
  )
}
