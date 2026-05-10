import { alpha, glow } from '../theme.js'

export default function Card({ children, palette, accent, style = {}, padding = 14 }) {
  return (
    <div style={{
      background: palette.surface, borderRadius: 16, padding,
      border: `1px solid ${alpha(accent || palette.border, accent ? 0.35 : 1)}`,
      boxShadow: accent ? glow(accent, 0.18, 18) : 'none',
      ...style,
    }}>{children}</div>
  )
}
