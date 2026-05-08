import { db, type ProgressEntry } from '@engine/db/schema';

export async function getLevelProgress(profileId: string, subject: string, worldId: string, levelId: string): Promise<ProgressEntry | undefined> {
  return db.progress.where('[profileId+subject+worldId+levelId]').equals([profileId, subject, worldId, levelId]).first();
}

export async function getWorldProgress(profileId: string, subject: string, worldId: string): Promise<ProgressEntry[]> {
  const all = await db.progress.where('profileId').equals(profileId).toArray();
  return all.filter((e) => e.subject === subject && e.worldId === worldId);
}

export async function recordLevelResult(
  profileId: string,
  subject: string,
  worldId: string,
  levelId: string,
  stars: 0 | 1 | 2 | 3,
  durationMs: number,
) {
  const existing = await getLevelProgress(profileId, subject, worldId, levelId);
  const now = Date.now();
  const newEntry: ProgressEntry = existing
    ? {
        ...existing,
        stars: Math.max(existing.stars, stars) as 0 | 1 | 2 | 3,
        attempts: existing.attempts + 1,
        fastestMs: existing.fastestMs === null ? durationMs : Math.min(existing.fastestMs, durationMs),
        lastPlayedAt: now,
        unlocked: true,
      }
    : {
        profileId,
        subject,
        worldId,
        levelId,
        stars,
        attempts: 1,
        fastestMs: durationMs,
        lastPlayedAt: now,
        unlocked: true,
      };
  await db.progress.put(newEntry);
}

export async function unlockLevel(profileId: string, subject: string, worldId: string, levelId: string) {
  const existing = await getLevelProgress(profileId, subject, worldId, levelId);
  if (existing?.unlocked) return;
  const entry: ProgressEntry = existing
    ? { ...existing, unlocked: true }
    : {
        profileId,
        subject,
        worldId,
        levelId,
        stars: 0,
        attempts: 0,
        fastestMs: null,
        lastPlayedAt: 0,
        unlocked: true,
      };
  await db.progress.put(entry);
}
