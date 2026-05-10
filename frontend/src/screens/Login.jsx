import { useState } from 'react'
import { alpha, glow } from '../theme.js'
import * as api from '../api.js'

export default function Login({ palette, onLogin }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fn = mode === 'login' ? api.login : api.register
      const user = await fn(name.trim(), password)
      onLogin(user)
    } catch (err) {
      setError(err.data?.error || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    border: `1px solid ${palette.border}`,
    background: palette.surface, color: palette.text,
    fontSize: 15, outline: 'none', transition: 'border-color 200ms',
  }

  return (
    <div style={{
      width: '100%', height: '100%', background: palette.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '0 32px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orb */}
      <div className="bt-orb" style={{
        position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 340, height: 340, borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(palette.accent, 0.22)} 0%, ${alpha(palette.accent2, 0.06)} 50%, transparent 70%)`,
        pointerEvents: 'none', filter: 'blur(8px)',
      }} />
      <div className="bt-orb" style={{
        position: 'absolute', bottom: -80, right: -80,
        width: 260, height: 260, borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(palette.accent2, 0.18)} 0%, transparent 70%)`,
        pointerEvents: 'none', filter: 'blur(8px)',
        animationDelay: '-3s',
      }} />

      {/* Logo */}
      <div className="bt-fadeup" style={{ marginBottom: 44, textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 22, margin: '0 auto 18px',
          background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `${glow(palette.accent, 0.5, 28)}, 0 0 0 1px ${alpha(palette.accent, 0.3)}`,
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3" fill="#fff" stroke="none"/>
            <circle cx="18" cy="16" r="3" fill="#fff" stroke="none"/>
          </svg>
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, color: palette.text }}>BandTrack</div>
        <div style={{ fontSize: 14, color: palette.muted, marginTop: 6, fontWeight: 500 }}>
          Gérez votre répertoire ensemble
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submit} style={{ width: '100%' }}>
        {/* Mode toggle */}
        <div style={{
          display: 'flex', marginBottom: 20, padding: 3,
          background: palette.surface, borderRadius: 13,
          border: `1px solid ${palette.border}`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 3, bottom: 3,
            left: mode === 'login' ? 3 : 'calc(50% + 0px)',
            width: 'calc(50% - 3px)',
            background: `linear-gradient(135deg, ${alpha(palette.accent, 0.22)}, ${alpha(palette.accent2, 0.16)})`,
            border: `1px solid ${alpha(palette.accent, 0.4)}`,
            borderRadius: 10,
            transition: 'left 200ms cubic-bezier(.3,.7,.4,1)',
            boxShadow: glow(palette.accent, 0.2, 10),
          }} />
          {[['login', 'Connexion'], ['register', 'Inscription']].map(([m, label]) => (
            <button key={m} type="button" onClick={() => setMode(m)} style={{
              flex: 1, position: 'relative', zIndex: 1,
              padding: '11px 0', border: 'none', background: 'transparent',
              color: m === mode ? palette.text : palette.muted,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              letterSpacing: -0.1,
            }}>{label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text" placeholder="Nom d'utilisateur"
            value={name} onChange={e => setName(e.target.value)}
            autoComplete="username" style={inputStyle}
          />
          <input
            type="password" placeholder="Mot de passe"
            value={password} onChange={e => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            style={inputStyle}
          />
        </div>

        {error && (
          <div style={{
            marginTop: 10, padding: '10px 14px', borderRadius: 10,
            background: alpha('#ef4444', 0.12), border: `1px solid ${alpha('#ef4444', 0.3)}`,
            color: '#f87171', fontSize: 13, textAlign: 'center',
          }}>{error}</div>
        )}

        <button type="submit" disabled={loading} style={{
          marginTop: 16, width: '100%', padding: '16px 0', borderRadius: 13, border: 'none',
          background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
          color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
          boxShadow: glow(palette.accent, 0.4, 18),
          opacity: loading ? 0.7 : 1, transition: 'opacity 200ms',
          letterSpacing: -0.2,
        }}>
          {loading ? '…' : (mode === 'login' ? 'Se connecter' : "S'inscrire")}
        </button>
      </form>

      {mode === 'register' && (
        <p style={{ marginTop: 18, fontSize: 12, color: palette.dim, textAlign: 'center', lineHeight: 1.5 }}>
          Le premier compte créé devient administrateur du groupe.
        </p>
      )}
    </div>
  )
}
