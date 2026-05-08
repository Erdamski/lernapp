/**
 * Echter Fisher-Yates-Shuffle. Liefert eine neue Array-Kopie.
 * Wichtig für Aufgaben-Optionen: damit die richtige Antwort
 * NICHT immer an gleicher Position steht.
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
