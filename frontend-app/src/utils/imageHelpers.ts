export const getInitials = (name: string): string => {
  if (!name) return '';
  const words = name.split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return words.map(word => word.charAt(0)).join('').toUpperCase();
};

export const generateSvgPlaceholder = (name: string): string => {
  const initials = getInitials(name);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'>
    <rect width='100%' height='100%' fill='#e0e0e0'/>
    <text x='50%' y='50%' font-size='40' fill='#757575' text-anchor='middle' dominant-baseline='middle'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};