import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import { AVATAR_COLORS, AVATAR_ITEMS, isItemUnlocked, type ItemSlot } from '@engine/avatar/items';
import AvatarSprite from '@ui/components/AvatarSprite';
import { db } from '@engine/db/schema';

interface Props {
  onClose: () => void;
}

export default function AvatarShop({ onClose }: Props) {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.activeProfile);
  const refresh = useAppStore((s) => s.refreshActiveProfile);
  const [activeSlot, setActiveSlot] = useState<ItemSlot>('outfit');

  if (!profile) return null;

  const items = AVATAR_ITEMS.filter((i) => i.slot === activeSlot);

  const updateAvatar = async (changes: Partial<typeof profile.avatar>) => {
    const newAvatar = { ...profile.avatar, ...changes };
    await db.profiles.put({ ...profile, avatar: newAvatar });
    await refresh();
  };

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto">
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full mb-4">
        <button onClick={onClose} className="text-3xl btn-pop">⬅️</button>
        <h2 className="text-3xl font-display">{t('avatar.title')}</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/20">
          <span className="text-xl">⭐</span>
          <span className="font-display">{profile.totalStars}</span>
        </div>
      </header>

      <div className="flex justify-center mb-6">
        <AvatarSprite config={profile.avatar} size={180} />
      </div>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {AVATAR_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => updateAvatar({ baseColor: c })}
            className={`w-12 h-12 rounded-full btn-pop border-4 ${profile.avatar.baseColor === c ? 'border-white' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {(['outfit', 'hat', 'tool'] as ItemSlot[]).map((slot) => (
          <button
            key={slot}
            onClick={() => setActiveSlot(slot)}
            className={`px-5 py-2 rounded-full font-display btn-pop ${
              activeSlot === slot ? 'bg-primary-500' : 'bg-white/10'
            }`}
          >
            {t(`avatar.${slot}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-w-3xl mx-auto w-full">
        {items.map((item) => {
          const unlocked = isItemUnlocked(item, profile.totalStars);
          const equipped = profile.avatar[`${item.slot}Id` as const] === item.id;
          return (
            <button
              key={item.id}
              onClick={() => unlocked && updateAvatar({ [`${item.slot}Id`]: item.id } as Partial<typeof profile.avatar>)}
              disabled={!unlocked}
              className={`card-tile p-4 flex flex-col items-center gap-1 btn-pop ${
                equipped ? 'bg-primary-500/40 ring-4 ring-primary-300' : unlocked ? 'bg-white/10' : 'bg-white/5'
              }`}
            >
              <div className={`text-5xl ${unlocked ? '' : 'grayscale opacity-30'}`}>{item.icon}</div>
              <div className="text-sm font-display text-center">{item.label}</div>
              {!unlocked && item.unlockRequirement.type === 'stars' && (
                <div className="text-xs text-yellow-300">⭐ {item.unlockRequirement.count}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
