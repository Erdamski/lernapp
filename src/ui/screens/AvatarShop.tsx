import { useState } from 'react';
import { useAppStore } from '@engine/state/store';
import { db } from '@engine/db/schema';
import PixelCharacter from '@ui/components/PixelCharacter';
import PixelButton from '@ui/components/PixelButton';
import PixelIcon, { type IconName } from '@ui/components/PixelIcon';
import PixelTitle from '@ui/components/PixelTitle';
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
  short: 'KURZ',
  spiky: 'STACHEL',
  long: 'LANG',
  pony: 'ZOPF',
  bun: 'DUTT',
  curly: 'LOCKEN',
};

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'skin', label: 'HAUT', icon: 'skin' },
  { id: 'hair', label: 'FRISUR', icon: 'hair' },
  { id: 'haircolor', label: 'HAARFARBE', icon: 'paint' },
  { id: 'top', label: 'OBERTEIL', icon: 'shirt' },
  { id: 'bottom', label: 'HOSE', icon: 'pants' },
];

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
        <button onClick={onClose} className="pixel-btn bg-bg-card border-ink-soft shadow-black shadow-pixel-sm w-14 h-14 p-0">
          <PixelIcon name="arrow-left" size={26} tone="white" />
        </button>
        <PixelTitle size="md">ANKLEIDEN</PixelTitle>
        <div className="pixel-btn bg-accent-coin border-ink shadow-amber-700 shadow-pixel-sm h-12 px-3 flex items-center gap-2 cursor-default">
          <PixelIcon name="star" size={20} />
          <span className="font-pixel text-[12px] text-ink">{profile.totalStars}</span>
        </div>
      </header>

      <div className="flex justify-center mb-6">
        <div className="rounded-chunk p-3 bg-gradient-to-b from-indigo-700 to-indigo-900 shadow-pixel-md shadow-ink border-4 border-ink">
          <PixelCharacter config={character} size={220} bg={null} />
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {TABS.map((tDef) => (
          <button
            key={tDef.id}
            onClick={() => setTab(tDef.id)}
            className={`pixel-btn border-ink shadow-pixel-sm h-12 px-3 flex items-center gap-2
              ${tab === tDef.id ? 'bg-primary-500 shadow-ink-soft' : 'bg-bg-card shadow-black hover:bg-bg-mid'}`}
          >
            <PixelIcon name={tDef.icon} size={20} />
            <span className="font-pixel text-[10px] text-white">{tDef.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto w-full pb-8">
        {tab === 'skin' && (
          <Grid>
            {SKIN_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.skinId === id}
                onClick={() => update({ skinId: id })}
                label={SKIN_COLORS[id].label.toUpperCase()}
                preview={<PixelCharacter config={{ ...character, skinId: id }} size={90} bg={null} />}
              />
            ))}
          </Grid>
        )}
        {tab === 'hair' && (
          <Grid>
            {HAIR_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.hairId === id}
                onClick={() => update({ hairId: id as HairId })}
                label={HAIR_LABELS[id]}
                preview={<PixelCharacter config={{ ...character, hairId: id }} size={90} bg={null} />}
              />
            ))}
          </Grid>
        )}
        {tab === 'haircolor' && (
          <Grid>
            {HAIR_COLOR_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.hairColorId === id}
                onClick={() => update({ hairColorId: id as HairColorId })}
                label={HAIR_COLORS[id].label.toUpperCase()}
                preview={
                  <div className="w-[90px] h-[90px] rounded-chunk flex items-center justify-center" style={{ background: HAIR_COLORS[id].fill }}>
                    <PixelCharacter config={{ ...character, hairColorId: id }} size={70} bg={null} />
                  </div>
                }
              />
            ))}
          </Grid>
        )}
        {tab === 'top' && (
          <Grid>
            {TOP_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.topId === id}
                onClick={() => update({ topId: id as TopId })}
                label={TOP_COLORS[id].label.toUpperCase()}
                preview={<PixelCharacter config={{ ...character, topId: id }} size={90} bg={null} />}
              />
            ))}
          </Grid>
        )}
        {tab === 'bottom' && (
          <Grid>
            {BOTTOM_OPTIONS.map((id) => (
              <PreviewCard
                key={id}
                active={character.bottomId === id}
                onClick={() => update({ bottomId: id as BottomId })}
                label={BOTTOM_COLORS[id].label.toUpperCase()}
                preview={<PixelCharacter config={{ ...character, bottomId: id }} size={90} bg={null} />}
              />
            ))}
          </Grid>
        )}

        <div className="flex justify-center mt-6">
          <PixelButton variant="success" size="lg" onClick={onClose}>FERTIG</PixelButton>
        </div>
      </div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">{children}</div>;
}

function PreviewCard({
  active,
  onClick,
  label,
  preview,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  preview: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`pixel-btn border-ink shadow-pixel-sm p-2 flex flex-col items-center gap-1 h-auto
        ${active ? 'bg-primary-500 shadow-ink-soft' : 'bg-bg-card shadow-black hover:bg-bg-mid'}`}
    >
      {preview}
      <span className="font-pixel text-[9px] text-white">{label}</span>
    </button>
  );
}
