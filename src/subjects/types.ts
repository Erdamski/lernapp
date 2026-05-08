/**
 * Gemeinsame Typen für alle Fach-Module.
 * Mathe, Deutsch etc. teilen sich diese Strukturen.
 */

import type { ComponentType } from 'react';

export interface SubjectDefinition {
  id: string;                     // 'math', 'german', ...
  labelKey: string;               // i18n key
  icon: string;                   // Emoji für die Insel-Karte (später Sprite)
  worlds: WorldDefinition[];
  diagnosticTaskFactory?: () => DiagnosticTask[];
}

export interface WorldDefinition {
  id: string;                     // 'world-1'
  classLevel: 1 | 2 | 3 | 4 | 5;
  labelKey: string;               // i18n key
  shortDescriptionKey?: string;
  introAudioKey: string;          // z. B. 'math/world1_intro'
  levels: LevelDefinition[];
  unlockRequirement?: { worldId: string; minStars: number };
}

export interface LevelDefinition {
  id: string;                     // 'level-1-1'
  labelKey: string;
  topicKey: string;               // 'math/topic/numbers_1_10'
  introAudioKey?: string;
  /** React-Komponente, die das Level rendert */
  component: ComponentType<LevelProps>;
  /** Wie viele Aufgaben pro Spieldurchgang */
  taskCount: number;
}

export interface LevelProps {
  onComplete: (result: LevelResult) => void;
  onExit: () => void;
}

export interface LevelResult {
  correct: number;
  total: number;
  durationMs: number;
  /** Sterne berechnen sich aus Genauigkeit + Tempo */
  stars: 0 | 1 | 2 | 3;
  taskKeys: string[];
  attempts: { taskKey: string; correct: boolean }[];
}

export interface DiagnosticTask {
  taskKey: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  worldId: string;
  /** React-Element für die Aufgabe */
  render: (onAnswer: (correct: boolean) => void) => React.ReactNode;
}
