/**
 * Sound-Effects-Manifest für die Lernapp.
 * Alle Game-Sounds in Pixel-/Chiptune-Stil, kindgerecht und kurz.
 *
 * Generieren: `npm run sound:generate`
 * Pfad nach Generierung: /public/sounds/{key}.mp3
 */

export interface SoundEntry {
  prompt: string;            // Beschreibung für ElevenLabs Sound-Generation
  duration: number;          // Sekunden (0.5 - 22)
  promptInfluence?: number;  // 0..1, wie stark dem Prompt gefolgt wird (default 0.3)
}

export const soundManifest: Record<string, SoundEntry> = {
  // ─── UI ───────────────────────────────────────────────────────────
  'ui/button-tap': {
    prompt: 'A short soft retro 8-bit blip when pressing a button, single note, friendly, then silence',
    duration: 0.5,
    promptInfluence: 0.4,
  },
  'ui/swoosh': {
    prompt: 'A quick gentle swoosh transition sound, like sliding between pages',
    duration: 0.5,
  },

  // ─── REWARDS ──────────────────────────────────────────────────────
  'reward/coin': {
    prompt: 'A classic 8-bit coin pickup sound, like in Mario, two ascending notes, bright',
    duration: 0.5,
    promptInfluence: 0.5,
  },
  'reward/star': {
    prompt: 'A magical sparkle chime with rising bell notes, celebratory',
    duration: 0.8,
    promptInfluence: 0.4,
  },
  'reward/levelup': {
    prompt: 'A triumphant 8-bit fanfare, three ascending bright notes, kid-friendly victory tune',
    duration: 1.5,
    promptInfluence: 0.5,
  },
  'reward/celebrate': {
    prompt: 'A short happy celebration sound with confetti pop and cheerful chime',
    duration: 1.2,
    promptInfluence: 0.4,
  },
  'reward/unlock': {
    prompt: 'A magical unlocking chime, gentle bell sequence ascending',
    duration: 1.0,
    promptInfluence: 0.4,
  },

  // ─── FEEDBACK ─────────────────────────────────────────────────────
  'feedback/correct': {
    prompt: 'A short positive 8-bit chime, two quick ascending notes, bright and friendly',
    duration: 0.5,
    promptInfluence: 0.5,
  },
  'feedback/wrong': {
    prompt: 'A soft gentle low tone indicating a small mistake, not harsh, like a friendly buzzer',
    duration: 0.5,
    promptInfluence: 0.4,
  },

  // ─── CHARACTER ────────────────────────────────────────────────────
  'character/walk': {
    prompt: 'A short pixel-style walking footstep, single soft tap, then silence',
    duration: 0.5,
  },
  'character/jump': {
    prompt: 'A short 8-bit jump sound, like Mario jumping, quick rising blip, then silence',
    duration: 0.5,
    promptInfluence: 0.5,
  },

  // ─── WORLD ────────────────────────────────────────────────────────
  'world/portal-enter': {
    prompt: 'A magical whoosh entering a portal, quick warp sound with sparkles',
    duration: 1.0,
    promptInfluence: 0.4,
  },
  'world/checkpoint': {
    prompt: 'A small bright chime indicating a checkpoint reached, two cheerful notes',
    duration: 0.7,
    promptInfluence: 0.4,
  },
};
