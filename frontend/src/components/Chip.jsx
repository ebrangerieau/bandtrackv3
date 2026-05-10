import { alpha } from '../theme.js'

export default function Chip({ children, color, icon }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 9px', borderRadius: 999,
      background: alpha(color, 0.12), color,
      fontSize: 11.5, fontWeight: 600,
      border: `1px solid ${alpha(color, 0.25)}`,
      letterSpacing: 0.1,
    }}>
      {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
      {children}
    </span>
  )
}
