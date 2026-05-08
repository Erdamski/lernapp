import { useState } from 'react';
import { useAppStore } from '@engine/state/store';
import { db } from '@engine/db/schema';
import PixelCharacter from '@ui/components/PixelCharacter';
import {
  BOTTOM_COLORS,
  BOTTOM_OPTIONS,
  HAIR_COLORS,
  HAIR_COLOR_OPTIONS,
  HAIR_OPTIONS,
  SKIN_COLORS,
  SKIN_OPTIONS,
  TOP_COLORS,
  TOP_OPTIONS,
  type BottomId,
  type CharacterConfig,
  type HairColorId,
  type HairId,
  type TopId,
} from '@engine/avatar/character';

interface Props {
  onClose: () => void;
}

type Tab = 'skin' | 'hair' | 'haircolor' | 'top' | 'bottom';

const HAIR_LABELS: Record<HairId, string> = {
  short: 'Kurz',
  spiky: 'Stachel',
  long: 'Lang',
  pony: 'Pferdeschwanz',
  bun: 'Dutt',
  curly: 'Locken',
};

/**
 * Ankleidezimmer: Pixel-Charakter anpassen.
 * Big tabs unten, viele Tap-Flächen, sofortige Vorschau oben.
 */
export default function AvatarShop({ onClose }: Props) {
  const profile = useAppStore((s) => s.activeProfile);
  const refresh = useAppStore((s) => s.refreshActiveProfile);
  const [tab, setTab] = useState<Tab>('hair');

  if (!profile) return null;

  const character = profile.character;

  const update = async (patch: Partial<CharacterConfig>) => {
    const next = { ...character, ...patch };
    await db.profiles.put({ ...profile, character: next });
    await refresh();
  };

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto">
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full mb-4">
        <button onClick={onClose} className="text-3xl btn-pop">⬅️</button>
        <h2 className="text-3xl font-display">👕 Ankleidezimmer</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/20">
          <span className="text-xl">⭐</span>
          <span className="font-display">{profile.totalStars}</span>
        </div>
      </header>

      <div className="flex justify-center mb-6">
        <div className="rounded-3xl p-2 bg-gradient-to-b from-indigo-700 to-indigo-900 shadow-2xl">
          <PixelCharacter config={character} size={220} bg={null} />
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        <TabBtn active={tab === 'skin'} onClick={() => setTab('skin')}>🧑 Haut</TabBtn>
        <TabBtn active={tab === 'hair'} onClick={() => setTab('hair')}>💇 Frisur</TabBtn>
        <TabBtn active={tab === 'haircolor'} onClick={() => setTab('haircolor')}>🎨 Haarfarbe</TabBtn>
        <TabBtn active={tab === 'top'} onClick={() => setTab('top')}>👕 Oberteil</TabBtn>
        <TabBtn active={tab === 'bottom'} onClick={() => setTab('bottom')}>👖 Hose</TabBtn>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        {tab === 'skin' && (
          <div className="grid grid-cols-5 gap-3">
            {SKIN_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.skinId === id}
                onClick={() => update({ skinId: id })}
                label={SKIN_COLORS[id].label}
                preview={<PixelCharacter config={{ ...character, skinId: id }} size={90} bg={null} />}
              />
            ))}
          </div>
        )}

        {tab === 'hair' && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {HAIR_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.hairId === id}
                onClick={() => update({ hairId: id as HairId })}
                label={HAIR_LABELS[id]}
                preview={<PixelCharacter config={{ ...character, hairId: id }} size={90} bg={null} />}
              />
            ))}
          </div>
        )}

        {tab === 'haircolor' && (
          <div className="grid grid-cols-5 gap-3">
            {HAIR_COLOR_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.hairColorId === id}
                onClick={() => update({ hairColorId: id as HairColorId })}
                label={HAIR_COLORS[id].label}
                preview={
                  <div className="w-[90px] h-[90px] rounded-2xl flex items-center justify-center" style={{ background: HAIR_COLORS[id].fill }}>
                    <PixelCharacter config={{ ...character, hairColorId: id }} size={70} bg={null} />
                  </div>
                }
              />
            ))}
          </div>
        )}

        {tab === 'top' && (
          <div className="grid grid-cols-5 gap-3">
            {TOP_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.topId === id}
                onClick={() => update({ topId: id as TopId })}
                label={TOP_COLORS[id].label}
                preview={<PixelCharacter config={{ ...character, topId: id }} size={90} bg={null} />}
              />
            ))}
          </div>
        )}

        {tab === 'bottom' && (
          <div className="grid grid-cols-5 gap-3">
            {BOTTOM_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.bottomId === id}
                onClick={() => update({ bottomId: id as BottomId })}
                label={BOTTOM_COLORS[id].label}
                preview={<PixelCharacter config={{ ...character, bottomId: id }} size={90} bg={null} />}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TabBtn({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-display btn-pop ${active ? 'bg-primary-500' : 'bg-white/10 hover:bg-white/20'}`}
    >
      {children}
    </button>
  );
}

function PreviewCard({ active, onClick, label, preview }: { active: boolean; onClick: () => void; label: string; preview: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`card-tile p-2 flex flex-col items-center gap-1 btn-pop ${
        active ? 'bg-primary-500/40 ring-4 ring-primary-300' : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      {preview}
      <div className="text-sm font-display">{label}</div>
    </button>
  );
}
