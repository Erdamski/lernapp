import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, type Profile, type ProgressEntry } from '@engine/db/schema';
import { useAppStore } from '@engine/state/store';
import AvatarSprite from '@ui/components/AvatarSprite';
import PixelIcon from '@ui/components/PixelIcon';
import PixelTitle from '@ui/components/PixelTitle';
import PixelButton from '@ui/components/PixelButton';
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
        <button onClick={onExit} className="pixel-btn bg-bg-card border-ink-soft shadow-black shadow-pixel-sm w-14 h-14 p-0">
          <PixelIcon name="arrow-left" size={26} tone="white" />
        </button>
        <PixelTitle size="lg">{t('parent.dashboard_title')}</PixelTitle>
        <div className="w-14" />
      </header>

      <div className="max-w-5xl mx-auto w-full">
        <PixelTitle size="sm" className="mb-4">Profile</PixelTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`pixel-btn border-ink shadow-pixel-sm p-3 flex flex-col items-center gap-2 h-auto
                ${selected?.id === p.id ? 'bg-primary-500 shadow-ink-soft' : 'bg-bg-card shadow-black hover:bg-bg-mid'}`}
            >
              <AvatarSprite config={p.character} size={80} />
              <div className="font-display font-bold text-white">{p.name}</div>
              <div className="flex items-center gap-2 text-xs">
                <PixelIcon name="star" size={14} />
                <span className="font-pixel text-[10px]">{p.totalStars}</span>
                <PixelIcon name="coin" size={14} />
                <span className="font-pixel text-[10px]">{p.coins}</span>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="bg-bg-card border-4 border-ink-soft shadow-pixel-md shadow-black rounded-chunk p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-display font-bold text-white">{selected.name}</h3>
              <PixelButton
                variant="danger"
                size="sm"
                onClick={() => {
                  if (confirm(`Profil ${selected.name} wirklich löschen?`)) {
                    deleteProfile(selected.id);
                    setSelected(null);
                  }
                }}
              >
                {t('profile.delete')}
              </PixelButton>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <Stat icon="star" label="Sterne" value={`${selected.totalStars}`} />
              <Stat icon="coin" label="Münzen" value={`${selected.coins}`} />
              <Stat icon="trophy" label="Levels" value={`${progress.filter((p) => p.stars > 0).length}`} />
              <Stat icon="play" label="Versuche" value={`${progress.reduce((sum, p) => sum + p.attempts, 0)}`} />
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

        <PixelTitle size="sm" className="mb-4">{t('parent.settings')}</PixelTitle>
        {settings && (
          <div className="bg-bg-card border-4 border-ink-soft shadow-pixel-md shadow-black rounded-chunk p-5 space-y-4">
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

function Stat({ icon, label, value }: { icon: 'star' | 'coin' | 'trophy' | 'play'; label: string; value: string }) {
  return (
    <div className="bg-bg-mid border-2 border-ink-soft rounded-chunk p-3 text-center">
      <div className="text-xs font-pixel text-white/50 uppercase mb-1">{label}</div>
      <div className="flex items-center justify-center gap-2">
        <PixelIcon name={icon} size={20} />
        <span className="text-xl font-pixel text-white">{value}</span>
      </div>
    </div>
  );
}
