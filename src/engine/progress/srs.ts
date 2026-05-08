import { db, type SrsItem } from '@engine/db/schema';

const DAY_MS = 24 * 60 * 60 * 1000;

const INITIAL_INTERVALS_DAYS = [1, 3, 7, 14, 30];

export async function recordAttempt(profileId: string, subject: string, taskKey: string, correct: boolean) {
  const existing = await db.srs.where('[profileId+subject+taskKey]').equals([profileId, subject, taskKey]).first();
  const now = Date.now();
  if (!existing) {
    const item: SrsItem = {
      profileId,
      subject,
      taskKey,
      ease: 2.5,
      intervalDays: correct ? INITIAL_INTERVALS_DAYS[0] : 0.25,
      nextDue: now + (correct ? INITIAL_INTERVALS_DAYS[0] * DAY_MS : 6 * 60 * 60 * 1000),
      consecutiveCorrect: correct ? 1 : 0,
      totalAttempts: 1,
      totalCorrect: correct ? 1 : 0,
    };
    await db.srs.put(item);
    return;
  }

  const next: SrsItem = {
    ...existing,
    totalAttempts: existing.totalAttempts + 1,
    totalCorrect: existing.totalCorrect + (correct ? 1 : 0),
    consecutiveCorrect: correct ? existing.consecutiveCorrect + 1 : 0,
  };

  if (correct) {
    const stage = Math.min(existing.consecutiveCorrect, INITIAL_INTERVALS_DAYS.length - 1);
    next.intervalDays = INITIAL_INTERVALS_DAYS[stage] * existing.ease;
    next.ease = Math.min(3.0, existing.ease + 0.05);
  } else {
    next.intervalDays = 0.25;
    next.ease = Math.max(1.3, existing.ease - 0.2);
  }

  next.nextDue = now + next.intervalDays * DAY_MS;
  await db.srs.put(next);
}

export async function getDueItems(profileId: string, subject: string, limit = 10): Promise<SrsItem[]> {
  const now = Date.now();
  return db.srs
    .where('profileId').equals(profileId)
    .filter((item) => item.subject === subject && item.nextDue <= now)
    .limit(limit)
    .toArray();
}

export async function getWeakItems(profileId: string, subject: string, threshold = 0.6, limit = 10): Promise<SrsItem[]> {
  const items = await db.srs.where('profileId').equals(profileId).toArray();
  return items
    .filter((i) => i.subject === subject && i.totalAttempts >= 2 && i.totalCorrect / i.totalAttempts < threshold)
    .sort((a, b) => a.totalCorrect / a.totalAttempts - b.totalCorrect / b.totalAttempts)
    .slice(0, limit);
}
