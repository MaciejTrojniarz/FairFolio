// Simple CSV utilities for browser downloads

export function sanitizeForCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  let str = String(value);
  // Prevent CSV injection in spreadsheet tools
  if (/^[=+\-@]/.test(str)) {
    str = "'" + str; // prefix apostrophe
  }
  // Normalize newlines
  str = str.replace(/\r?\n/g, '\n');
  // Escape quotes by doubling them
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function arrayToCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const headerLine = headers.map(h => sanitizeForCsv(h)).join(',');
  const dataLines = rows.map(row => row.map(col => sanitizeForCsv(col)).join(','));
  return [headerLine, ...dataLines].join('\n');
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
