import type { SubjectDefinition } from '@subjects/types';
import Level1_1 from './world1/Level1_1_Numbers_1_10';

/**
 * Mathematik – Fach-Definition nach Berliner Rahmenlehrplan.
 *
 * Welt-Roadmap (siehe PLAN.md):
 *   Welt 1 = Klasse 1 (ZR 20, +/–)
 *   Welt 2 = Klasse 2 (ZR 100, Einmaleins)
 *   Welt 3 = Klasse 3 (ZR 1.000)
 *   Welt 4 = Klasse 4 (ZR 1 Mio.)
 *
 * Im MVP ist nur Welt 1 / Level 1.1 spielbar. Weitere Levels werden
 * inkrementell ergänzt — Strukturen sind aber bereits angelegt.
 */
export const mathSubject: SubjectDefinition = {
  id: 'math',
  labelKey: 'subjects.math',
  icon: '🧮',
  worlds: [
    {
      id: 'world-1',
      classLevel: 1,
      labelKey: 'math.world1_label',
      introAudioKey: 'math/world1_intro',
      levels: [
        {
          id: 'level-1-1',
          labelKey: 'math.level_1_1_label',
          topicKey: 'numbers_1_10',
          introAudioKey: 'math/level_1_1_intro',
          component: Level1_1,
          taskCount: 5,
        },
        // Platzhalter – kommen in Phase 2/3
        // { id: 'level-1-2', labelKey: 'math.level_1_2_label', topicKey: 'decomposition', component: ..., taskCount: 6 },
        // { id: 'level-1-3', labelKey: 'math.level_1_3_label', topicKey: 'add_zr10', component: ..., taskCount: 8 },
      ],
    },
  ],
};
