import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import { SUBJECTS } from '@subjects/index';
import type { LevelDefinition, LevelResult, WorldDefinition } from '@subjects/types';
import { audio } from '@engine/audio/AudioPlayer';
import { recordLevelResult, getWorldProgress } from '@engine/progress/levels';
import AvatarShop from './AvatarShop';
import type { ProgressEntry } from '@engine/db/schema';

type View = 'islands' | 'world' | 'level' | 'shop' | 'level-result';

export default function WorldMapScreen() {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.activeProfile);
  const refresh = useAppStore((s) => s.refreshActiveProfile);
  const logout = useAppStore((s) => s.logoutProfile);
  const addCoins = useAppStore((s) => s.addCoins);

  const [view, setView] = useState<View>('islands');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeWorld, setActiveWorld] = useState<WorldDefinition | null>(null);
  const [activeLevel, setActiveLevel] = useState<LevelDefinition | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [lastResult, setLastResult] = useState<LevelResult | null>(null);

  useEffect(() => {
    if (!profile || !activeWorld || !activeSubjectId) return;
    getWorldProgress(profile.id, activeSubjectId, activeWorld.id).then(setProgress);
  }, [profile, activeWorld, activeSubjectId, view]);

  if (!profile) return null;

  const handleLevelComplete = async (result: LevelResult) => {
    if (!profile || !activeSubjectId || !activeWorld || !activeLevel) return;
    await recordLevelResult(profile.id, activeSubjectId, activeWorld.id, activeLevel.id, result.stars, result.durationMs);
    const coinsEarned = result.stars * 10 + result.correct * 2;
    await addCoins(coinsEarned);
    await refresh();
    setLastResult(result);
    setView('level-result');
  };

  // Insel-Karte
  if (view === 'islands') {
    return (
      <div className="w-full h-full flex flex-col p-6">
        <header className="flex items-center justify-between max-w-6xl mx-auto w-full mb-6">
          <button onClick={logout} className="text-3xl btn-pop" aria-label="Profil wechseln">🔄</button>
          <h1 className="text-4xl font-display">{t('world.map_title')}</h1>
          <button onClick={() => setView('shop')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 hover:bg-amber-400/30 btn-pop">
            <span className="text-2xl">🪙</span>
            <span className="text-xl font-display">{profile.coins}</span>
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center gap-6 flex-wrap">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSubjectId(s.id);
                setActiveWorld(s.worlds[0]);
                setView('world');
              }}
              className="card-tile bg-emerald-500/20 hover:bg-emerald-500/30 p-8 flex flex-col items-center gap-3 btn-pop w-64"
            >
              <div className="text-8xl mb-2">{s.icon}</div>
              <div className="text-3xl font-display">{t(s.labelKey)}</div>
            </button>
          ))}
          {/* Teaser für künftige Fächer */}
          <div className="card-tile bg-white/5 p-8 flex flex-col items-center gap-3 w-64 opacity-50">
            <div className="text-8xl mb-2">🔒</div>
            <div className="text-2xl font-display text-white/60">Bald verfügbar</div>
            <div className="text-sm text-white/40">Deutsch · Englisch · …</div>
          </div>
        </div>

        <footer className="flex justify-center gap-4 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/20">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-display">{profile.totalStars}</span>
          </div>
          <button onClick={() => setView('shop')} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 font-display btn-pop">
            👕 {t('avatar.title')}
          </button>
        </footer>
      </div>
    );
  }

  // Welt-Detail (Levels einer Welt)
  if (view === 'world' && activeWorld && activeSubjectId) {
    return (
      <div className="w-full h-full flex flex-col p-6">
        <header className="flex items-center justify-between max-w-6xl mx-auto w-full mb-6">
          <button onClick={() => setView('islands')} className="text-3xl btn-pop">⬅️</button>
          <h2 className="text-3xl font-display">{t(activeWorld.labelKey, `Klasse ${activeWorld.classLevel}`)}</h2>
          <button onClick={() => audio.play(activeWorld.introAudioKey, { fallbackToTTS: true })} className="text-3xl btn-pop">🔊</button>
        </header>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full content-start">
          {activeWorld.levels.map((level, idx) => {
            const entry = progress.find((p) => p.levelId === level.id);
            const previous = idx > 0 ? activeWorld.levels[idx - 1] : null;
            const previousEntry = previous ? progress.find((p) => p.levelId === previous.id) : null;
            const isUnlocked = idx === 0 || (previousEntry?.stars ?? 0) >= 1;
            return (
              <button
                key={level.id}
                onClick={() => isUnlocked && (setActiveLevel(level), setView('level'))}
                disabled={!isUnlocked}
                className={`card-tile p-6 flex flex-col items-center gap-2 btn-pop ${
                  isUnlocked ? 'bg-primary-500/20 hover:bg-primary-500/30' : 'bg-white/5 opacity-60'
                }`}
              >
                <div className="text-6xl">{isUnlocked ? '🎯' : '🔒'}</div>
                <div className="text-xl font-display text-center">{t(level.labelKey, `Level ${idx + 1}`)}</div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((s) => (
                    <span key={s} className={`text-2xl ${(entry?.stars ?? 0) >= s ? 'text-yellow-400' : 'text-white/20'}`}>⭐</span>
                  ))}
                </div>
              </button>
            );
          })}

          {/* Teaser für noch nicht implementierte Levels */}
          {activeWorld.levels.length < 8 && (
            <div className="card-tile bg-white/5 p-6 flex flex-col items-center gap-2 opacity-40">
              <div className="text-6xl">🚧</div>
              <div className="text-lg font-display text-center">Bald verfügbar</div>
              <div className="text-xs text-white/50">Mehr Welten kommen!</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Level spielen
  if (view === 'level' && activeLevel) {
    const Component = activeLevel.component;
    return <Component onComplete={handleLevelComplete} onExit={() => setView('world')} />;
  }

  // Level-Ergebnis
  if (view === 'level-result' && lastResult) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="text-9xl mb-6 animate-pop">{lastResult.stars >= 3 ? '🏆' : lastResult.stars >= 2 ? '🌟' : lastResult.stars >= 1 ? '👏' : '💪'}</div>
        <h2 className="text-5xl font-display mb-3">
          {lastResult.stars >= 1 ? 'Geschafft!' : 'Weiter geht\'s!'}
        </h2>
        <div className="flex gap-3 my-6">
          {[1, 2, 3].map((s) => (
            <span key={s} className={`text-7xl ${lastResult.stars >= s ? 'text-yellow-400 animate-pop' : 'text-white/20'}`}>⭐</span>
          ))}
        </div>
        <p className="text-xl text-white/70 mb-2">
          {lastResult.correct} von {lastResult.total} richtig
        </p>
        <p className="text-amber-300 mb-8">+{lastResult.stars * 10 + lastResult.correct * 2} 🪙</p>
        <div className="flex gap-3">
          <button onClick={() => setView('world')} className="px-6 py-3 rounded-full bg-white/10 font-display btn-pop">Welt</button>
          <button onClick={() => setView('level')} className="px-6 py-3 rounded-full bg-primary-500 font-display btn-pop">Nochmal</button>
        </div>
      </div>
    );
  }

  // Avatar-Shop / Customization
  if (view === 'shop') {
    return <AvatarShop onClose={() => setView('islands')} />;
  }

  return null;
}
