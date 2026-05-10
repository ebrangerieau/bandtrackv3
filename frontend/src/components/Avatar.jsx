import { alpha, glow } from '../theme.js'

export default function Avatar({ name, size = 32, palette, you = false, color }) {
  const initial = name ? name.trim()[0].toUpperCase() : '?'
  const bg = you
    ? `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`
    : (color || alpha(palette.text, 0.1))
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
  )
}
