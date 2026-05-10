// theme.jsx — BandTrack palettes + theme context.

const PALETTES = {
  violet: {
    name: 'Nuit violette',
    bg: '#0a0a14',
    surface: '#111120',
    surface2: '#1a1a2e',
    border: '#252540',
    text: '#e8e8f8',
    muted: '#7a7ab0',
    dim: '#5858a0',
    accent: '#8b5cf6',
    accent2: '#ec4899',
    accent3: '#22d3ee',
  },
  rouge: {
    name: 'Scène rouge',
    bg: '#100a0a',
    surface: '#1a1010',
    surface2: '#261818',
    border: '#3a2020',
    text: '#f4e8e8',
    muted: '#b07878',
    dim: '#8a5858',
    accent: '#e84444',
    accent2: '#f97316',
    accent3: '#fbbf24',
  },
  vert: {
    name: 'Studio vert',
    bg: '#080f0a',
    surface: '#0f1a12',
    surface2: '#162118',
    border: '#1e3024',
    text: '#e0f0e4',
    muted: '#6c9a7a',
    dim: '#487858',
    accent: '#22c55e',
    accent2: '#34d399',
    accent3: '#a3e635',
  },
  bleu: {
    name: 'Scène bleue',
    bg: '#080c14',
    surface: '#0e1420',
    surface2: '#151e30',
    border: '#1e2e48',
    text: '#dce8f8',
    muted: '#6c8aaa',
    dim: '#486888',
    accent: '#3b82f6',
    accent2: '#818cf8',
    accent3: '#38bdf8',
  },
};

// Statut tokens (communs à toutes les palettes)
const STATUS = {
  suggestion: { color: '#f59e0b', label: 'Idée',          icon: '💡', short: 'Idée' },
  learning:   { color: '#6366f1', label: 'En apprentissage', icon: '📚', short: 'En cours' },
  ready:      { color: '#10b981', label: 'Prêt à jouer',  icon: '✅', short: 'Prêt' },
  archived:   { color: '#6b7280', label: 'Archivé',       icon: '📦', short: 'Archivé' },
};

// Hex → rgba, e.g. alpha('#8b5cf6', 0.2) → 'rgba(139,92,246,0.2)'
function alpha(hex, a) {
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// Soft glow for accent-bearing surfaces.
function glow(hex, intensity = 0.35, size = 24) {
  return `0 0 ${size}px ${alpha(hex, intensity)}`;
}

Object.assign(window, { PALETTES, STATUS, alpha, glow });
