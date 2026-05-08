import { create } from 'zustand';
import { db, type Profile } from '@engine/db/schema';
import { generateId } from '@engine/util/id';

interface AppState {
  profiles: Profile[];
  activeProfile: Profile | null;
  loadProfiles: () => Promise<void>;
  selectProfile: (id: string) => Promise<void>;
  logoutProfile: () => void;
  createProfile: (data: Omit<Profile, 'id' | 'createdAt' | 'coins' | 'totalStars' | 'onboardingDone'>) => Promise<Profile>;
  deleteProfile: (id: string) => Promise<void>;
  refreshActiveProfile: () => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  setOnboardingDone: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  profiles: [],
  activeProfile: null,

  loadProfiles: async () => {
    try {
      const profiles = await db.profiles.orderBy('createdAt').toArray();
      set({ profiles });
    } catch (err) {
      console.error('[loadProfiles]', err);
    }
  },

  selectProfile: async (id) => {
    try {
      const profile = await db.profiles.get(id);
      if (profile) set({ activeProfile: profile });
    } catch (err) {
      console.error('[selectProfile]', err);
    }
  },

  logoutProfile: () => set({ activeProfile: null }),

  createProfile: async (data) => {
    const profile: Profile = {
      ...data,
      id: generateId(),
      createdAt: Date.now(),
      coins: 0,
      totalStars: 0,
      onboardingDone: false,
    };
    try {
      await db.profiles.put(profile);
    } catch (err) {
      console.error('[createProfile] db.put failed', err);
      throw err;
    }
    await get().loadProfiles();
    set({ activeProfile: profile });
    return profile;
  },

  deleteProfile: async (id) => {
    await db.profiles.delete(id);
    await db.progress.where('profileId').equals(id).delete();
    await db.srs.where('profileId').equals(id).delete();
    await db.sessions.where('profileId').equals(id).delete();
    await get().loadProfiles();
    if (get().activeProfile?.id === id) set({ activeProfile: null });
  },

  refreshActiveProfile: async () => {
    const current = get().activeProfile;
    if (!current) return;
    const updated = await db.profiles.get(current.id);
    if (updated) set({ activeProfile: updated });
  },

  addCoins: async (amount) => {
    const current = get().activeProfile;
    if (!current) return;
    const updated = { ...current, coins: current.coins + amount };
    await db.profiles.put(updated);
    set({ activeProfile: updated });
  },

  setOnboardingDone: async () => {
    const current = get().activeProfile;
    if (!current) return;
    const updated = { ...current, onboardingDone: true };
    await db.profiles.put(updated);
    set({ activeProfile: updated });
  },
}));
