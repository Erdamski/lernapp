import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import { SUBJECTS } from '@subjects/index';
import type { LevelDefinition, LevelResult, WorldDefinition } from '@subjects/types';
import { audio } from '@engine/audio/AudioPlayer';
import { recordLevelResult, getWorldProgress } from '@engine/progress/levels';
import CharacterWizard from './CharacterWizard';
import { db } from '@engine/db/schema';
import PixelButton from '@ui/components/PixelButton';
import PixelIcon from '@ui/components/PixelIcon';
import PixelTitle from '@ui/components/PixelTitle';
import IconButton from '@ui/components/IconButton';
import WorldRoadmap from '@ui/components/WorldRoadmap';
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

  if (view === 'islands') {
    return (
      <div className="w-full h-full flex flex-col p-6">
        <header className="flex items-center justify-between max-w-6xl mx-auto w-full mb-6">
          <IconButton onClick={logout} aria-label="Profil wechseln">
            <PixelIcon name="swap" size={26} tone="white" />
          </IconButton>
          <PixelTitle size="lg">{t('world.map_title')}</PixelTitle>
          <button onClick={() => setView('shop')} className="pixel-btn pixel-btn-glossy bg-accent-coin border-ink shadow-amber-700 shadow-pixel-md px-4 h-14 flex items-center gap-2">
            <PixelIcon name="coin" size={24} />
            <span className="font-pixel text-[14px] text-ink">{profile.coins}</span>
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
              className="pixel-btn bg-emerald-500 hover:bg-emerald-400 border-ink shadow-emerald-900 shadow-pixel-md p-6 flex flex-col items-center gap-3 w-64 h-auto"
            >
              <SubjectIcon id={s.id} />
              <span className="font-pixel text-[18px] text-white">{t(s.labelKey)}</span>
            </button>
          ))}

          <div className="pixel-btn bg-bg-card border-ink-soft shadow-black shadow-pixel-md p-6 flex flex-col items-center gap-3 w-64 opacity-60 cursor-default">
            <PixelIcon name="lock" size={64} />
            <span className="font-pixel text-[14px] text-white/60">Bald verfügbar</span>
            <span className="text-xs font-body text-white/40">Deutsch · Englisch</span>
          </div>
        </div>

        <footer className="flex justify-center gap-4 mt-6">
          <div className="pixel-btn bg-bg-card border-ink-soft shadow-black shadow-pixel-sm h-12 px-4 flex items-center gap-2 cursor-default">
            <PixelIcon name="star" size={22} />
            <span className="font-pixel text-[14px]">{profile.totalStars}</span>
          </div>
          <PixelButton variant="ghost" size="md" onClick={() => setView('shop')} iconLeft={<PixelIcon name="shirt" size={22} />}>
            Ankleiden
          </PixelButton>
        </footer>
      </div>
    );
  }

  if (view === 'world' && activeWorld && activeSubjectId) {
    return (
      <div className="w-full h-full flex flex-col p-6">
        <header className="flex items-center justify-between max-w-6xl mx-auto w-full mb-6">
          <IconButton onClick={() => setView('islands')}>
            <PixelIcon name="arrow-left" size={26} tone="white" />
          </IconButton>
          <PixelTitle size="md">{t(activeWorld.labelKey, `Klasse ${activeWorld.classLevel}`)}</PixelTitle>
          <IconButton onClick={() => audio.play(activeWorld.introAudioKey, { fallbackToTTS: true })}>
            <PixelIcon name="speaker" size={26} tone="white" />
          </IconButton>
        </header>

        <div className="flex-1 flex items-center justify-center w-full px-2">
          <WorldRoadmap
            levels={activeWorld.levels}
            progress={progress}
            character={profile.character}
            theme="math"
            onLevelTap={(level) => {
              setActiveLevel(level);
              setView('level');
            }}
          />
        </div>

        {/* Aktuell ausgewählter Level-Name */}
        <div className="text-center mt-3 mb-2">
          <span className="font-pixel text-[14px] text-white/70">Tippe auf einen Punkt zum Spielen</span>
        </div>
      </div>
    );
  }

  if (view === 'level' && activeLevel) {
    const Component = activeLevel.component;
    return <Component onComplete={handleLevelComplete} onExit={() => setView('world')} />;
  }

  if (view === 'level-result' && lastResult) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 animate-pop">
          <PixelIcon name="trophy" size={140} />
        </div>
        <PixelTitle size="lg" color="gold" className="mb-3">
          {lastResult.stars >= 1 ? 'GESCHAFFT!' : 'WEITER GEHT\'S!'}
        </PixelTitle>
        <div className="flex gap-3 my-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={lastResult.stars >= s ? 'animate-pop' : ''} style={{ animationDelay: `${s * 100}ms` }}>
              <PixelIcon name={lastResult.stars >= s ? 'star' : 'star-empty'} size={72} />
            </div>
          ))}
        </div>
        <p className="text-xl font-body text-white/70 mb-2">
          {lastResult.correct} von {lastResult.total} richtig
        </p>
        <div className="flex items-center gap-2 mb-8">
          <PixelIcon name="coin" size={28} />
          <span className="font-pixel text-[20px] text-accent-coin">+{lastResult.stars * 10 + lastResult.correct * 2}</span>
        </div>
        <div className="flex gap-3">
          <PixelButton variant="ghost" size="md" onClick={() => setView('world')}>Welt</PixelButton>
          <PixelButton variant="primary" size="md" onClick={() => setView('level')}>Nochmal</PixelButton>
        </div>
      </div>
    );
  }

  if (view === 'shop') {
    return (
      <CharacterWizard
        mode="edit"
        initialCharacter={profile.character}
        onCancel={() => setView('islands')}
        onSubmit={async (character) => {
          await db.profiles.put({ ...profile, character });
          await refresh();
          setView('islands');
        }}
      />
    );
  }

  return null;
}

function SubjectIcon({ id }: { id: string }) {
  if (id === 'math') {
    return (
      <div className="flex gap-2">
        <PixelIcon name="plus" size={28} tone="white" />
        <PixelIcon name="minus" size={28} tone="white" />
        <PixelIcon name="equals" size={28} tone="white" />
      </div>
    );
  }
  return <PixelIcon name="lock" size={48} />;
}
