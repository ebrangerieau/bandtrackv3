export default function StatusBar({ palette }) {
  const now = new Date()
  const time = now.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 47,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', fontSize: 15, fontWeight: 600, color: palette.text,
      zIndex: 50, pointerEvents: 'none',
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 2C4.4 2 1.7 3.2 0 5.1l1.4 1.4C2.7 4.9 4.9 4 7.5 4S12.3 4.9 13.6 6.5L15 5.1C13.3 3.2 10.6 2 7.5 2zm0 3C5.5 5 3.7 5.7 2.4 6.9l1.4 1.4C4.7 7.4 6 6.9 7.5 6.9s2.8.5 3.7 1.4l1.4-1.4C11.3 5.7 9.5 5 7.5 5zm0 3c-1.2 0-2.2.5-3 1.3L7.5 11l3-1.7c-.8-.8-1.8-1.3-3-1.3z"/>
        </svg>
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" opacity="0.5"/>
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/>
          <rect x="24" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5"/>
        </svg>
      </span>
    </div>
  )
}
