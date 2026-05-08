import Dexie, { type Table } from 'dexie';
import type { SupportedLanguage } from '@i18n/init';

export interface Profile {
  id: string;
  name: string;
  age: number;
  language: SupportedLanguage;
  pin?: string;
  avatar: AvatarConfig;
  createdAt: number;
  onboardingDone: boolean;
  coins: number;
  totalStars: number;
}

export interface AvatarConfig {
  baseColor: string;
  outfitId: string;
  hatId: string;
  toolId: string;
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

export class LernappDB extends Dexie {
  profiles!: Table<Profile, string>;
  progress!: Table<ProgressEntry, number>;
  srs!: Table<SrsItem, number>;
  settings!: Table<Settings, string>;
  sessions!: Table<PlaySession, number>;

  constructor() {
    super('lernapp');
    this.version(1).stores({
      profiles: 'id, name, createdAt',
      progress: '++id, [profileId+subject+worldId+levelId], profileId, lastPlayedAt',
      srs: '++id, [profileId+subject+taskKey], profileId, nextDue',
      settings: 'id',
      sessions: '++id, profileId, startedAt',
    });
  }
}

export const db = new LernappDB();
