export function sanitizeInput(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  const str = String(input);
  // Remove dangerous characters that could be used for CSS injection or XSS
  return str.replace(/[;{}"'<>\\]/g, '').trim();
}

export function sanitizeHex(hex: string | undefined | null): string {
  if (!hex || typeof hex !== 'string') return '#000000';
  const sanitized = hex.trim();
  // Ensure it's a valid hex code (3, 4, 6, or 8 characters, optional #)
  if (/^#?[0-9A-Fa-f]{3,8}$/.test(sanitized)) {
    return sanitized;
  }
  return '#000000'; // Fallback to black if invalid
}
