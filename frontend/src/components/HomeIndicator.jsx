export default function HomeIndicator({ palette }) {
  return (
    <div style={{
      position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
      width: 134, height: 5, borderRadius: 3, background: palette.text, opacity: 0.7,
      zIndex: 50,
    }} />
  )
}
