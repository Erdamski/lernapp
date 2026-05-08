import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, type Profile, type ProgressEntry } from '@engine/db/schema';
import { useAppStore } from '@engine/state/store';
import AvatarSprite from '@ui/components/AvatarSprite';
import { getWeakItems } from '@engine/progress/srs';

interface Props {
  onExit: () => void;
}

export default function ParentDashboard({ onExit }: Props) {
  const { t } = useTranslation();
  const profiles = useAppStore((s) => s.profiles);
  const loadProfiles = useAppStore((s) => s.loadProfiles);
  const deleteProfile = useAppStore((s) => s.deleteProfile);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [weakTasks, setWeakTasks] = useState<{ taskKey: string; ratio: number }[]>([]);
  const [settings, setSettings] = useState<{ maxPlayMinutesPerDay: number; audioEnabled: boolean; musicEnabled: boolean } | null>(null);

  useEffect(() => {
    loadProfiles();
    db.settings.get('singleton').then((s) => {
      if (s) setSettings({ maxPlayMinutesPerDay: s.maxPlayMinutesPerDay, audioEnabled: s.audioEnabled, musicEnabled: s.musicEnabled });
    });
  }, [loadProfiles]);

  useEffect(() => {
    if (!selected) {
      setProgress([]);
      setWeakTasks([]);
      return;
    }
    db.progress.where('profileId').equals(selected.id).toArray().then(setProgress);
    getWeakItems(selected.id, 'math').then((items) =>
      setWeakTasks(items.map((i) => ({ taskKey: i.taskKey, ratio: i.totalCorrect / i.totalAttempts }))),
    );
  }, [selected]);

  const updateSetting = async (changes: Partial<NonNullable<typeof settings>>) => {
    if (!settings) return;
    const next = { ...settings, ...changes };
    setSettings(next);
    const existing = (await db.settings.get('singleton')) ?? {
      id: 'singleton' as const,
      defaultLanguage: 'de' as const,
    };
    await db.settings.put({ ...existing, ...next, id: 'singleton' });
  };

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto">
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full mb-6">
        <button onClick={onExit} className="text-3xl btn-pop">⬅️</button>
        <h1 className="text-4xl font-display">👨‍👩‍👧 {t('parent.dashboard_title')}</h1>
        <div />
      </header>

      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-display mb-3">Profile</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`card-tile p-3 flex flex-col items-center gap-2 btn-pop ${
                selected?.id === p.id ? 'bg-primary-500/30 ring-2 ring-primary-300' : 'bg-white/5'
              }`}
            >
              <AvatarSprite config={p.character} size={70} />
              <div className="font-display">{p.name}</div>
              <div className="text-xs text-white/60">⭐ {p.totalStars} · 🪙 {p.coins}</div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="card-tile bg-white/5 p-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-display">{selected.name}</h3>
              <button
                onClick={() => {
                  if (confirm(`Profil ${selected.name} wirklich löschen?`)) {
                    deleteProfile(selected.id);
                    setSelected(null);
                  }
                }}
                className="text-red-400 text-sm hover:underline"
              >
                {t('profile.delete')}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <Stat label="Sterne" value={`⭐ ${selected.totalStars}`} />
              <Stat label="Münzen" value={`🪙 ${selected.coins}`} />
              <Stat label="Levels" value={`${progress.filter((p) => p.stars > 0).length}`} />
              <Stat label="Versuche" value={`${progress.reduce((sum, p) => sum + p.attempts, 0)}`} />
            </div>

            {weakTasks.length > 0 && (
              <div>
                <h4 className="font-display mb-2">Übungsbedarf</h4>
                <ul className="space-y-1">
                  {weakTasks.slice(0, 5).map((w) => (
                    <li key={w.taskKey} className="flex justify-between text-sm bg-white/5 rounded-lg px-3 py-1">
                      <span>{w.taskKey}</span>
                      <span className="text-amber-300">{Math.round(w.ratio * 100)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <h2 className="text-2xl font-display mb-3">{t('parent.settings')}</h2>
        {settings && (
          <div className="card-tile bg-white/5 p-4 space-y-4">
            <label className="block">
              <span className="font-display block mb-1">{t('parent.play_time_limit')}: {settings.maxPlayMinutesPerDay} min</span>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={settings.maxPlayMinutesPerDay}
                onChange={(e) => updateSetting({ maxPlayMinutesPerDay: parseInt(e.target.value) })}
                className="w-full"
              />
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.audioEnabled}
                onChange={(e) => updateSetting({ audioEnabled: e.target.checked })}
                className="w-5 h-5"
              />
              <span>Sprachausgabe</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.musicEnabled}
                onChange={(e) => updateSetting({ musicEnabled: e.target.checked })}
                className="w-5 h-5"
              />
              <span>Musik</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-2xl p-3 text-center">
      <div className="text-xs text-white/50 uppercase">{label}</div>
      <div className="text-xl font-display">{value}</div>
    </div>
  );
}
