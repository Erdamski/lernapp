import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import AvatarSprite from '@ui/components/AvatarSprite';
import { AVATAR_COLORS, getDefaultAvatar } from '@engine/avatar/items';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@i18n/init';
import PinPad from '@ui/components/PinPad';

interface Props {
  onParentZone: () => void;
}

export default function ProfileSelect({ onParentZone }: Props) {
  const { t } = useTranslation();
  const profiles = useAppStore((s) => s.profiles);
  const loadProfiles = useAppStore((s) => s.loadProfiles);
  const selectProfile = useAppStore((s) => s.selectProfile);
  const createProfile = useAppStore((s) => s.createProfile);
  const [showCreate, setShowCreate] = useState(false);
  const [pinFor, setPinFor] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const profileForPin = pinFor ? profiles.find((p) => p.id === pinFor) : null;

  return (
    <div className="w-full h-full flex flex-col items-center p-6 overflow-y-auto">
      <h1 className="text-5xl font-display mt-4 mb-8 text-center">{t('profile.select_title')}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl w-full">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              if (p.pin) setPinFor(p.id);
              else selectProfile(p.id);
            }}
            className="card-tile bg-white/5 hover:bg-white/10 p-4 flex flex-col items-center gap-3 btn-pop"
          >
            <AvatarSprite config={p.avatar} size={120} />
            <div className="text-2xl font-display">{p.name}</div>
            <div className="text-sm text-white/60">{p.age} J · {LANGUAGE_LABELS[p.language]}</div>
          </button>
        ))}

        <button
          onClick={() => setShowCreate(true)}
          className="card-tile bg-primary-500/20 hover:bg-primary-500/30 p-4 flex flex-col items-center gap-3 btn-pop border-dashed"
        >
          <div className="w-[120px] h-[120px] rounded-3xl border-4 border-dashed border-white/30 flex items-center justify-center text-6xl">+</div>
          <div className="text-2xl font-display">{t('profile.create_new')}</div>
        </button>
      </div>

      <button
        onClick={onParentZone}
        className="mt-10 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 font-display btn-pop"
      >
        🔒 {t('profile.parent_zone')}
      </button>

      {showCreate && (
        <CreateProfileModal
          onClose={() => setShowCreate(false)}
          onCreate={async (data) => {
            const p = await createProfile(data);
            setShowCreate(false);
            await selectProfile(p.id);
          }}
        />
      )}

      {profileForPin && (
        <PinPad
          title={t('pin.enter_title')}
          expectedPin={profileForPin.pin}
          onSuccess={() => {
            selectProfile(profileForPin.id);
            setPinFor(null);
          }}
          onCancel={() => setPinFor(null)}
        />
      )}
    </div>
  );
}

function CreateProfileModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: { name: string; age: number; language: SupportedLanguage; avatar: ReturnType<typeof getDefaultAvatar>; pin?: string }) => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [language, setLanguage] = useState<SupportedLanguage>('de');
  const [avatar, setAvatar] = useState(getDefaultAvatar());

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card-tile bg-slate-800 p-6 max-w-md w-full">
        <h2 className="text-3xl font-display mb-4">{t('profile.create_new')}</h2>

        <div className="flex justify-center mb-4">
          <AvatarSprite config={avatar} size={140} />
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setAvatar({ ...avatar, baseColor: c })}
              className={`w-10 h-10 rounded-full btn-pop border-4 ${avatar.baseColor === c ? 'border-white' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <label className="block mb-2 text-white/70">{t('profile.name')}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-700 rounded-xl p-3 mb-3 text-white text-xl"
          maxLength={20}
        />

        <label className="block mb-2 text-white/70">{t('profile.age')}</label>
        <input
          type="number"
          value={age}
          min={4}
          max={14}
          onChange={(e) => setAge(parseInt(e.target.value) || 6)}
          className="w-full bg-slate-700 rounded-xl p-3 mb-3 text-white text-xl"
        />

        <label className="block mb-2 text-white/70">{t('profile.language')}</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          className="w-full bg-slate-700 rounded-xl p-3 mb-4 text-white text-xl"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>
          ))}
        </select>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-3 rounded-full bg-white/10 font-display btn-pop">Abbrechen</button>
          <button
            onClick={() => name.trim() && onCreate({ name: name.trim(), age, language, avatar })}
            disabled={!name.trim()}
            className="px-5 py-3 rounded-full bg-primary-500 disabled:opacity-40 font-display btn-pop"
          >
            {t('profile.create')}
          </button>
        </div>
      </div>
    </div>
  );
}
