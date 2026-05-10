import { STATUS, alpha } from '../theme.js'

export default function StatusPill({ status, size = 'md', dashed = false }) {
  const s = STATUS[status]
  if (!s) return null
  const { color } = s
  const small = size === 'sm'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: small ? '3px 8px' : '5px 11px',
      borderRadius: 999,
      background: alpha(color, dashed ? 0.06 : 0.15),
      color, fontSize: small ? 10.5 : 12, fontWeight: 700,
      letterSpacing: 0.2, textTransform: 'uppercase',
      border: dashed ? `1px dashed ${alpha(color, 0.5)}` : `1px solid ${alpha(color, 0.3)}`,
    }}>
      <span className="bt-dot-pulse" style={{
        width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: '50%', background: color,
        boxShadow: `0 0 6px ${alpha(color, 0.8)}`,
      }} />
      {small ? s.short : s.label}
    </span>
  )
}
