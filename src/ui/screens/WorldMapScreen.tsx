import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import { SUBJECTS } from '@subjects/index';
import type { LevelDefinition, LevelResult, WorldDefinition } from '@subjects/types';
import { audio } from '@engine/audio/AudioPlayer';
import { sfx } from '@engine/audio/SoundPlayer';
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
    if (result.stars >= 1) sfx.levelUp();
    sfx.coin();
    setView('level-result');
  };

  if (view === 'islands') {
    return (
      <div className="w-full h-full flex flex-col p-4 sm:p-6">
        {/* Top-Bar: Profil-Switch links, Münz-Anzeige rechts */}
        <div className="flex items-start justify-between w-full">
          <IconButton onClick={logout} aria-label="Profil wechseln">
            <PixelIcon name="swap" size={26} tone="white" />
          </IconButton>
          <div className="pixel-btn bg-accent-coin border-0 shadow-amber-700 shadow-pixel-sm px-4 h-12 flex items-center gap-2 cursor-default">
            <PixelIcon name="coin" size={22} />
            <span className="font-pixel text-[14px] text-ink">{profile.coins}</span>
          </div>
        </div>

        {/* Zentraler Block: Headline + Inseln + Ankleiden – alles dicht beieinander */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="bg-amber-700 border-4 border-ink rounded-chunk px-6 py-2 shadow-pixel-md shadow-amber-900">
            <PixelTitle size="lg" color="white">{t('world.map_title')}</PixelTitle>
          </div>

          <div className="flex items-start justify-center gap-6 flex-wrap">
            {SUBJECTS.map((s) => (
              <SubjectIsland
                key={s.id}
                id={s.id}
                labelKey={s.labelKey}
                onClick={() => {
                  setActiveSubjectId(s.id);
                  setActiveWorld(s.worlds[0]);
                  setView('world');
                }}
              />
            ))}
            <SubjectIsland id="locked-german" labelKey="subjects.german" disabled />
            <SubjectIsland id="locked-english" labelKey="subjects.english" disabled />
          </div>

          <PixelButton variant="ghost" size="md" onClick={() => setView('shop')} iconLeft={<PixelIcon name="shirt" size={22} />}>
            Ankleiden
          </PixelButton>
        </div>
      </div>
    );
  }

  if (view === 'world' && activeWorld && activeSubjectId) {
    return (
      <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-y-auto">
        <header className="flex items-center justify-between max-w-6xl mx-auto w-full mb-4">
          <IconButton onClick={() => setView('islands')}>
            <PixelIcon name="arrow-left" size={26} tone="white" />
          </IconButton>
          <div className="bg-amber-700 border-4 border-ink rounded-chunk px-5 py-1 shadow-pixel-md shadow-amber-900">
            <PixelTitle size="md" color="white">{t(activeWorld.labelKey, `Klasse ${activeWorld.classLevel}`)}</PixelTitle>
          </div>
          <IconButton onClick={() => audio.play(activeWorld.introAudioKey, { fallbackToTTS: true })}>
            <PixelIcon name="speaker" size={26} tone="white" />
          </IconButton>
        </header>

        <div className="flex-1 flex items-center justify-center w-full">
          <WorldRoadmap
            levels={activeWorld.levels}
            progress={progress}
            character={profile.character}
            onLevelTap={(level) => {
              setActiveLevel(level);
              setView('level');
            }}
          />
        </div>

        <div className="text-center mt-3 mb-2">
          <span className="font-pixel text-[14px] text-amber-900 bg-amber-200/80 border-2 border-amber-900 rounded-chunk px-3 py-1">
            Tippe auf ein Haus zum Spielen
          </span>
        </div>
      </div>
    );
  }

  if (view === 'level' && activeLevel) {
    const Component = activeLevel.component;
    // Level läuft auf dunklem Spiel-Hintergrund, damit die hellen Sky-Farben
    // nicht von Frage-/Antwort-Texten ablenken.
    return (
      <div className="w-full h-full bg-gradient-to-b from-bg-deep to-bg-mid">
        <Component onComplete={handleLevelComplete} onExit={() => setView('world')} />
      </div>
    );
  }

  if (view === 'level-result' && lastResult && activeWorld && activeLevel) {
    const currentIdx = activeWorld.levels.findIndex((l) => l.id === activeLevel.id);
    const nextLevel = lastResult.stars >= 1 && currentIdx >= 0 ? activeWorld.levels[currentIdx + 1] : undefined;
    return (
      <div className="w-full h-full bg-gradient-to-b from-bg-deep to-bg-mid">
        <LevelResultScreen
          result={lastResult}
          onWorld={() => setView('world')}
          onAgain={() => setView('level')}
          onNext={
            nextLevel
              ? () => {
                  setActiveLevel(nextLevel);
                  setView('level');
                }
              : undefined
          }
        />
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

/**
 * Subject als großes Insel-Schild mit Pixel-Icon. Kindgerecht & lese-arm.
 * Einheitliche Höhe für alle Karten (auch wenn locked) – wirkt wie eine Galerie.
 */
const ISLAND_BOX = 200;
const ISLAND_LABEL_H = 48;

function SubjectIsland({ id, labelKey, onClick, disabled }: { id: string; labelKey: string; onClick?: () => void; disabled?: boolean }) {
  const { t } = useTranslation();
  const isMath = id === 'math';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center transition-transform ${
        disabled ? 'opacity-60' : 'active:scale-95 hover:-translate-y-1'
      }`}
      style={{ width: ISLAND_BOX }}
    >
      <div
        className="rounded-chunk border-4 border-ink shadow-pixel-md shadow-ink flex items-center justify-center"
        style={{
          width: ISLAND_BOX,
          height: ISLAND_BOX,
          background: disabled
            ? 'linear-gradient(180deg, #94a3b8, #475569)'
            : isMath
              ? 'linear-gradient(180deg, #38bdf8, #2563eb)'
              : 'linear-gradient(180deg, #f472b6, #be185d)',
        }}
      >
        {disabled ? (
          <PixelIcon name="lock" size={96} />
        ) : isMath ? (
          <MathIslandIcon />
        ) : (
          <div className="font-pixel text-[36px] text-white">A B C</div>
        )}
      </div>

      {/* Holz-Schild – fixe Höhe → alle Cards uniform */}
      <div
        className="bg-amber-700 border-4 border-ink rounded-chunk px-5 mt-3 shadow-pixel-md shadow-amber-900 flex items-center justify-center"
        style={{ height: ISLAND_LABEL_H, minWidth: 140 }}
      >
        <span className={`font-pixel text-[14px] ${disabled ? 'text-amber-200/70' : 'text-white'}`}>
          {t(labelKey).toUpperCase()}
        </span>
      </div>
    </button>
  );
}

function MathIslandIcon() {
  return (
    <div className="grid grid-cols-3 gap-2 font-pixel text-[28px] text-white">
      <span>1</span>
      <span>+</span>
      <span>2</span>
      <span>3</span>
      <span>−</span>
      <span>4</span>
      <span>5</span>
      <span>=</span>
      <span>?</span>
    </div>
  );
}

function LevelResultScreen({
  result,
  onWorld,
  onAgain,
  onNext,
}: {
  result: LevelResult;
  onWorld: () => void;
  onAgain: () => void;
  onNext?: () => void;
}) {
  useEffect(() => {
    for (let i = 0; i < result.stars; i++) {
      window.setTimeout(() => sfx.star(), 200 + i * 350);
    }
    console.info('[LevelResult]', {
      correct: result.correct,
      total: result.total,
      accuracy: result.correct / result.total,
      stars: result.stars,
      attempts: result.attempts,
    });
  }, [result]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 animate-pop">
        <PixelIcon name="trophy" size={140} />
      </div>
      <PixelTitle size="lg" color="gold" className="mb-3">
        {result.stars >= 1 ? 'GESCHAFFT!' : "WEITER GEHT'S!"}
      </PixelTitle>
      <div className="flex gap-3 my-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={result.stars >= s ? 'animate-pop' : ''} style={{ animationDelay: `${s * 350}ms` }}>
            <PixelIcon name={result.stars >= s ? 'star' : 'star-empty'} size={72} />
          </div>
        ))}
      </div>
      <div className="bg-amber-200 border-4 border-amber-900 rounded-chunk px-5 py-2 mb-3">
        <p className="text-xl font-body font-bold text-amber-900">
          {result.correct} von {result.total} richtig
        </p>
      </div>
      <div className="flex items-center gap-2 mb-8 bg-amber-100 border-4 border-amber-900 rounded-chunk px-4 py-1">
        <PixelIcon name="coin" size={28} />
        <span className="font-pixel text-[20px] text-amber-900">+{result.stars * 10 + result.correct * 2}</span>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <PixelButton variant="ghost" size="md" onClick={onWorld}>Welt</PixelButton>
        <PixelButton variant="ghost" size="md" onClick={onAgain}>Nochmal</PixelButton>
        {onNext && (
          <PixelButton
            variant="success"
            size="lg"
            onClick={onNext}
            iconRight={<PixelIcon name="arrow-right" size={22} tone="white" />}
          >
            NÄCHSTES LEVEL
          </PixelButton>
        )}
      </div>
    </div>
  );
}
