export const getInitials = (name: string): string => {
  if (!name) return '';
  // Split on any non-letter characters (punctuation, numbers, whitespace)
  const words = name.split(/[^\p{L}]+/u).filter(Boolean);
  if (words.length === 0) return '';
  // Take up to first two words for initials
  const initials = words.slice(0, 2).map(w => w.charAt(0).toUpperCase());
  return initials.join('');
};

export const generateSvgPlaceholder = (name: string): string => {
  const initials = getInitials(name);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'>
    <rect width='100%' height='100%' fill='#e0e0e0'/>
    <text x='50%' y='50%' font-size='40' fill='#757575' text-anchor='middle' dominant-baseline='middle'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};