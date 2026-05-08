import type { SubjectDefinition } from '@subjects/types';
import Level1_1 from './world1/Level1_1_Numbers_1_10';
import Level1_2 from './world1/Level1_2_Decomposition';
import Level1_3 from './world1/Level1_3_Plus_10';
import Level1_4 from './world1/Level1_4_Minus_10';
import Level1_5 from './world1/Level1_5_Numbers_to_20';
import Level1_6 from './world1/Level1_6_PlusMinus_to_20';
import Level1_7 from './world1/Level1_7_Crossing_10';
import Level1_8 from './world1/Level1_8_Shapes_Money_Time';

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
        {
          id: 'level-1-2',
          labelKey: 'math.level_1_2_label',
          topicKey: 'decomposition',
          component: Level1_2,
          taskCount: 5,
        },
        {
          id: 'level-1-3',
          labelKey: 'math.level_1_3_label',
          topicKey: 'add_zr10',
          component: Level1_3,
          taskCount: 5,
        },
        {
          id: 'level-1-4',
          labelKey: 'math.level_1_4_label',
          topicKey: 'sub_zr10',
          component: Level1_4,
          taskCount: 5,
        },
        {
          id: 'level-1-5',
          labelKey: 'math.level_1_5_label',
          topicKey: 'numbers_to_20',
          component: Level1_5,
          taskCount: 5,
        },
        {
          id: 'level-1-6',
          labelKey: 'math.level_1_6_label',
          topicKey: 'plusminus_to_20',
          component: Level1_6,
          taskCount: 5,
        },
        {
          id: 'level-1-7',
          labelKey: 'math.level_1_7_label',
          topicKey: 'crossing_10',
          component: Level1_7,
          taskCount: 5,
        },
        {
          id: 'level-1-8',
          labelKey: 'math.level_1_8_label',
          topicKey: 'shapes_money_time',
          component: Level1_8,
          taskCount: 5,
        },
      ],
    },
  ],
};
