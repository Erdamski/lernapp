/**
 * UUID-Generator mit Fallback.
 *
 * `crypto.randomUUID()` ist nur in *Secure Contexts* (HTTPS / localhost) verfügbar.
 * Beim Zugriff über LAN-IP (http://192.168.x.x:5173) auf iPad/Handy ist es nicht
 * verfügbar — daher dieser Fallback auf Basis von `crypto.getRandomValues`.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') {
      try {
        return crypto.randomUUID();
      } catch {
        // weiter zum Fallback
      }
    }
    if (typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      // RFC 4122 Variante 4
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
      return (
        hex.slice(0, 4).join('') +
        '-' +
        hex.slice(4, 6).join('') +
        '-' +
        hex.slice(6, 8).join('') +
        '-' +
        hex.slice(8, 10).join('') +
        '-' +
        hex.slice(10, 16).join('')
      );
    }
  }
  // Letzter Fallback (nicht kryptografisch, aber kollisionssicher genug für lokale Profile)
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}
