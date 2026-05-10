import { alpha } from '../theme.js'

export default function LevelBar({ value, max = 10, height = 6, palette, mode = 'level', color }) {
  const pct = Math.max(0, Math.min(1, value / max))
  const fill = mode === 'level'
    ? 'linear-gradient(90deg, #ef4444 0%, #f97316 30%, #fbbf24 55%, #84cc16 78%, #22c55e 100%)'
    : (color || palette.accent)
  return (
    <div style={{ width: '100%', height, borderRadius: height, background: alpha(palette.text, 0.06), overflow: 'hidden' }}>
      <div className="bt-bar-grow" style={{
        width: `${pct * 100}%`, height: '100%', background: fill, borderRadius: height,
        boxShadow: mode === 'level' ? `0 0 8px ${alpha('#22c55e', 0.3 * pct)}` : 'none',
        transition: 'width 240ms ease',
      }} />
    </div>
  )
}
