import Dexie, { type Table } from 'dexie';
import type { SupportedLanguage } from '@i18n/init';
import type { CharacterConfig } from '@engine/avatar/character';

export interface Profile {
  id: string;
  name: string;
  age: number;
  language: SupportedLanguage;
  pin?: string;
  character: CharacterConfig;
  createdAt: number;
  onboardingDone: boolean;
  coins: number;
  totalStars: number;
}

export interface ProgressEntry {
  id?: number;
  profileId: string;
  subject: string;          // 'math'
  worldId: string;          // 'world-1'
  levelId: string;          // 'level-1-1'
  stars: 0 | 1 | 2 | 3;
  attempts: number;
  fastestMs: number | null;
  lastPlayedAt: number;
  unlocked: boolean;
}

export interface SrsItem {
  id?: number;
  profileId: string;
  subject: string;
  taskKey: string;          // unique identifier for an exercise type, e.g. 'math:add:3+4'
  ease: number;             // 2.5 default
  intervalDays: number;
  nextDue: number;          // timestamp ms
  consecutiveCorrect: number;
  totalAttempts: number;
  totalCorrect: number;
}

export interface Settings {
  id: 'singleton';
  parentPin?: string;
  defaultLanguage: SupportedLanguage;
  maxPlayMinutesPerDay: number;
  audioEnabled: boolean;
  musicEnabled: boolean;
}

export interface PlaySession {
  id?: number;
  profileId: string;
  startedAt: number;
  endedAt: number | null;
  durationMs: number;
  starsEarned: number;
  coinsEarned: number;
}

export interface CachedAudio {
  id: string;            // z. B. `welcome:${profileId}`
  profileId: string;
  kind: string;          // 'welcome', 'level-intro', etc.
  text: string;          // Originaltext, zur Cache-Invalidierung bei Namensänderung
  blob: Blob;
  language: string;
  createdAt: number;
}

export class LernappDB extends Dexie {
  profiles!: Table<Profile, string>;
  progress!: Table<ProgressEntry, number>;
  srs!: Table<SrsItem, number>;
  settings!: Table<Settings, string>;
  sessions!: Table<PlaySession, number>;
  audioCache!: Table<CachedAudio, string>;

  constructor() {
    super('lernapp');
    this.version(1).stores({
      profiles: 'id, name, createdAt',
      progress: '++id, [profileId+subject+worldId+levelId], profileId, lastPlayedAt',
      srs: '++id, [profileId+subject+taskKey], profileId, nextDue',
      settings: 'id',
      sessions: '++id, profileId, startedAt',
    });
    // v2: Avatar-Schema von items zu pixel-character migriert.
    this.version(2)
      .stores({
        profiles: 'id, name, createdAt',
        progress: '++id, [profileId+subject+worldId+levelId], profileId, lastPlayedAt',
        srs: '++id, [profileId+subject+taskKey], profileId, nextDue',
        settings: 'id',
        sessions: '++id, profileId, startedAt',
        audioCache: 'id, profileId, kind',
      })
      .upgrade(async (tx) => {
        await tx.table('profiles').toCollection().modify((p: Record<string, unknown>) => {
          if (!p.character) {
            p.character = {
              presetId: 'boy_1', skinId: 'tan', hairId: 'short', hairColorId: 'brown',
              topId: 'tshirt_red', bottomId: 'pants_blue',
            };
          }
          delete p.avatar;
        });
      });
    // v3+v4: Reservierte Versionen für bereits offene DBs (no-op upgrades).
    // Verhindert VersionError wenn Browser-DB durch frühere Code-Stände
    // bereits auf höherer Version war.
    this.version(3).stores({
      profiles: 'id, name, createdAt',
      progress: '++id, [profileId+subject+worldId+levelId], profileId, lastPlayedAt',
      srs: '++id, [profileId+subject+taskKey], profileId, nextDue',
      settings: 'id',
      sessions: '++id, profileId, startedAt',
      audioCache: 'id, profileId, kind',
    });
    this.version(4).stores({
      profiles: 'id, name, createdAt',
      progress: '++id, [profileId+subject+worldId+levelId], profileId, lastPlayedAt',
      srs: '++id, [profileId+subject+taskKey], profileId, nextDue',
      settings: 'id',
      sessions: '++id, profileId, startedAt',
      audioCache: 'id, profileId, kind',
    });
  }
}

export const db = new LernappDB();

/**
 * Defensive Initialisierung: Falls die IndexedDB in einem inkompatiblen Zustand ist
 * (z. B. höhere Versionsnummer aus früherem Code-Stand), löschen und neu anlegen.
 * Das verhindert Blank-Screen-Probleme bei Schema-Rollback.
 */
db.open().catch(async (err) => {
  console.warn('[db] open failed, resetting database', err);
  try {
    db.close();
    await Dexie.delete('lernapp');
    await db.open();
    console.info('[db] reset successful');
  } catch (e) {
    console.error('[db] reset failed', e);
  }
});
