import type { SubjectDefinition } from './types';
import { mathSubject } from './math/manifest';

/**
 * Liste aller verfügbaren Fächer.
 * Weitere Fächer (Deutsch, Englisch, Türkisch, Russisch) werden hier ergänzt.
 */
export const SUBJECTS: SubjectDefinition[] = [mathSubject];

export function getSubject(id: string): SubjectDefinition | undefined {
  return SUBJECTS.find((s) => s.id === id);
}
