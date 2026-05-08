import { useMemo, useState } from 'react';
import PixelCharacter from '@ui/components/PixelCharacter';
import PixelButton from '@ui/components/PixelButton';
import PixelIcon, { type IconName } from '@ui/components/PixelIcon';
import PixelTitle from '@ui/components/PixelTitle';
import {
  BOTTOM_COLORS,
  BOTTOM_OPTIONS,
  CHARACTER_PRESETS,
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
  type SkinId,
  type TopId,
} from '@engine/avatar/character';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@i18n/init';

type SlotStep = 'preset' | 'skin' | 'hair' | 'haircolor' | 'top' | 'bottom';
type Step = SlotStep | 'details';

interface CreatePayload {
  character: CharacterConfig;
  name: string;
  age: number;
  language: SupportedLanguage;
}

interface CreateProps {
  mode: 'create';
  onSubmit: (data: CreatePayload) => Promise<void>;
  onCancel: () => void;
}

interface EditProps {
  mode: 'edit';
  initialCharacter: CharacterConfig;
  onSubmit: (character: CharacterConfig) => Promise<void>;
  onCancel: () => void;
}

type Props = CreateProps | EditProps;

const SLOT_STEPS: { id: SlotStep; title: string; icon: IconName }[] = [
  { id: 'preset', title: 'WÄHLE EINEN STARTER', icon: 'play' },
  { id: 'skin', title: 'HAUTFARBE', icon: 'skin' },
  { id: 'hair', title: 'FRISUR', icon: 'hair' },
  { id: 'haircolor', title: 'HAARFARBE', icon: 'paint' },
  { id: 'top', title: 'OBERTEIL', icon: 'shirt' },
  { id: 'bottom', title: 'HOSE', icon: 'pants' },
];

const HAIR_LABELS: Record<HairId, string> = {
  short: 'KURZ', spiky: 'STACHEL', long: 'LANG', pony: 'ZOPF', bun: 'DUTT', curly: 'LOCKEN',
};

export default function CharacterWizard(props: Props) {
  const isEdit = props.mode === 'edit';
  const initial = isEdit ? props.initialCharacter : CHARACTER_PRESETS[0].config;
  const [character, setCharacter] = useState<CharacterConfig>(initial);

  // Step-Reihenfolge
  const STEPS: Step[] = useMemo(
    () => (isEdit ? ['skin', 'hair', 'haircolor', 'top', 'bottom'] : ['preset', 'skin', 'hair', 'haircolor', 'top', 'bottom', 'details']),
    [isEdit],
  );
  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = STEPS[stepIdx];

  // Details-State (nur create)
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [language, setLanguage] = useState<SupportedLanguage>('de');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepLabel = currentStep === 'details' ? 'DEIN NAME' : SLOT_STEPS.find((s) => s.id === currentStep)!.title;
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === STEPS.length - 1;
  const canAdvance = currentStep === 'details' ? name.trim().length > 0 : true;

  const advance = async () => {
    if (!canAdvance) return;
    if (!isLast) {
      setStepIdx((i) => i + 1);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        await (props as EditProps).onSubmit(character);
      } else {
        await (props as CreateProps).onSubmit({ character, name: name.trim(), age, language });
      }
    } catch (err) {
      console.error('[CharacterWizard]', err);
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen');
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (isFirst) props.onCancel();
    else setStepIdx((i) => i - 1);
  };

  const jumpTo = (step: Step) => {
    const idx = STEPS.indexOf(step);
    if (idx >= 0) setStepIdx(idx);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-bg-deep">
      {/* Top-Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b-4 border-ink bg-bg-mid">
        <button
          onClick={goBack}
          disabled={submitting}
          className="pixel-btn bg-bg-card border-ink-soft shadow-black shadow-pixel-sm w-14 h-14 p-0"
          aria-label="Zurück"
        >
          <PixelIcon name="arrow-left" size={26} tone="white" />
        </button>
        <PixelTitle size="md">{stepLabel}</PixelTitle>
        <div className="font-pixel text-[12px] text-white/60 w-14 text-right">
          {stepIdx + 1}/{STEPS.length}
        </div>
      </header>

      {/* Edit-Mode: Tab-Leiste zum direkten Springen */}
      {isEdit && currentStep !== 'details' && (
        <div className="flex justify-center gap-2 py-3 flex-wrap border-b-2 border-ink-soft bg-bg-mid/50">
          {SLOT_STEPS.filter((s) => s.id !== 'preset').map((s) => (
            <button
              key={s.id}
              onClick={() => jumpTo(s.id)}
              className={`pixel-btn border-ink shadow-pixel-sm h-12 px-3 flex items-center gap-2
                ${currentStep === s.id ? 'bg-primary-500 shadow-ink-soft' : 'bg-bg-card shadow-black hover:bg-bg-mid'}`}
            >
              <PixelIcon name={s.icon} size={20} />
              <span className="font-pixel text-[10px] text-white">{s.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-center">
          {/* Live-Preview */}
          {currentStep !== 'preset' && (
            <div className="lg:sticky lg:top-4 shrink-0">
              <div className="rounded-chunk p-4 bg-gradient-to-b from-indigo-700 to-indigo-900 shadow-pixel-md shadow-ink border-4 border-ink">
                <PixelCharacter config={character} size={240} bg={null} />
              </div>
            </div>
          )}

          {/* Optionen */}
          <div className="flex-1 w-full">
            {currentStep === 'preset' && <PresetGrid value={character.presetId} onChange={(c) => setCharacter(c)} />}
            {currentStep === 'skin' && (
              <OptionGrid
                options={SKIN_OPTIONS.map((id) => ({
                  id,
                  label: SKIN_COLORS[id].label.toUpperCase(),
                  preview: <PixelCharacter config={{ ...character, skinId: id }} size={120} bg={null} />,
                }))}
                value={character.skinId}
                onChange={(id) => setCharacter({ ...character, skinId: id as SkinId })}
              />
            )}
            {currentStep === 'hair' && (
              <OptionGrid
                options={HAIR_OPTIONS.map((id) => ({
                  id,
                  label: HAIR_LABELS[id],
                  preview: <PixelCharacter config={{ ...character, hairId: id }} size={120} bg={null} />,
                }))}
                value={character.hairId}
                onChange={(id) => setCharacter({ ...character, hairId: id as HairId })}
              />
            )}
            {currentStep === 'haircolor' && (
              <OptionGrid
                options={HAIR_COLOR_OPTIONS.map((id) => ({
                  id,
                  label: HAIR_COLORS[id].label.toUpperCase(),
                  preview: (
                    <div
                      className="w-[120px] h-[120px] rounded-chunk flex items-center justify-center border-4 border-ink"
                      style={{ background: HAIR_COLORS[id].fill }}
                    >
                      <PixelCharacter config={{ ...character, hairColorId: id }} size={90} bg={null} />
                    </div>
                  ),
                }))}
                value={character.hairColorId}
                onChange={(id) => setCharacter({ ...character, hairColorId: id as HairColorId })}
              />
            )}
            {currentStep === 'top' && (
              <OptionGrid
                options={TOP_OPTIONS.map((id) => ({
                  id,
                  label: TOP_COLORS[id].label.toUpperCase(),
                  preview: <PixelCharacter config={{ ...character, topId: id }} size={120} bg={null} />,
                }))}
                value={character.topId}
                onChange={(id) => setCharacter({ ...character, topId: id as TopId })}
              />
            )}
            {currentStep === 'bottom' && (
              <OptionGrid
                options={BOTTOM_OPTIONS.map((id) => ({
                  id,
                  label: BOTTOM_COLORS[id].label.toUpperCase(),
                  preview: <PixelCharacter config={{ ...character, bottomId: id }} size={120} bg={null} />,
                }))}
                value={character.bottomId}
                onChange={(id) => setCharacter({ ...character, bottomId: id as BottomId })}
              />
            )}
            {currentStep === 'details' && (
              <DetailsForm
                name={name}
                age={age}
                language={language}
                onName={setName}
                onAge={setAge}
                onLanguage={setLanguage}
                error={error}
              />
            )}
          </div>
        </div>
      </main>

      {/* Bottom-CTA */}
      <footer className="border-t-4 border-ink bg-bg-mid p-4 sm:p-6 flex items-center justify-end gap-3">
        {!isFirst && (
          <PixelButton
            variant="ghost"
            size="lg"
            onClick={goBack}
            disabled={submitting}
            iconLeft={<PixelIcon name="arrow-left" size={22} tone="white" />}
          >
            ZURÜCK
          </PixelButton>
        )}
        <PixelButton
          variant={isLast ? 'success' : 'primary'}
          size="lg"
          onClick={advance}
          disabled={!canAdvance || submitting}
          iconRight={isLast ? <PixelIcon name="check" size={22} tone="white" /> : <PixelIcon name="arrow-right" size={22} tone="white" />}
        >
          {isLast ? (isEdit ? 'SPEICHERN' : 'SPIELEN') : 'WEITER'}
        </PixelButton>
      </footer>
    </div>
  );
}

function PresetGrid({ value, onChange }: { value: string; onChange: (c: CharacterConfig) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {CHARACTER_PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onChange(preset.config)}
          className={`pixel-btn border-ink shadow-pixel-md p-4 flex flex-col items-center gap-2 h-auto
            ${value === preset.id ? 'bg-primary-500 shadow-ink-soft' : 'bg-bg-card shadow-black hover:bg-bg-mid'}`}
        >
          <PixelCharacter config={preset.config} size={140} bg={null} />
          <span className="font-pixel text-[14px] text-white">{preset.label.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

interface OptionItem {
  id: string;
  label: string;
  preview: React.ReactNode;
}

function OptionGrid({ options, value, onChange }: { options: OptionItem[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`pixel-btn border-ink shadow-pixel-md p-3 flex flex-col items-center gap-2 h-auto
            ${value === opt.id ? 'bg-primary-500 shadow-ink-soft' : 'bg-bg-card shadow-black hover:bg-bg-mid'}`}
        >
          {opt.preview}
          <span className="font-pixel text-[12px] text-white">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function DetailsForm({
  name,
  age,
  language,
  onName,
  onAge,
  onLanguage,
  error,
}: {
  name: string;
  age: number;
  language: SupportedLanguage;
  onName: (v: string) => void;
  onAge: (v: number) => void;
  onLanguage: (v: SupportedLanguage) => void;
  error: string | null;
}) {
  return (
    <div className="max-w-xl mx-auto w-full space-y-4">
      <label className="block">
        <span className="font-pixel text-[12px] text-white/70 uppercase">Name</span>
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          autoFocus
          placeholder="Dein Name"
          className="mt-2 w-full bg-bg-card border-4 border-ink-soft rounded-chunk p-4 text-white text-3xl font-body font-bold"
          maxLength={20}
        />
      </label>
      <label className="block">
        <span className="font-pixel text-[12px] text-white/70 uppercase">Alter</span>
        <input
          type="number"
          value={age}
          min={4}
          max={14}
          onChange={(e) => onAge(parseInt(e.target.value) || 6)}
          className="mt-2 w-full bg-bg-card border-4 border-ink-soft rounded-chunk p-4 text-white text-3xl font-body font-bold"
        />
      </label>
      <label className="block">
        <span className="font-pixel text-[12px] text-white/70 uppercase">Sprache</span>
        <select
          value={language}
          onChange={(e) => onLanguage(e.target.value as SupportedLanguage)}
          className="mt-2 w-full bg-bg-card border-4 border-ink-soft rounded-chunk p-4 text-white text-3xl font-body font-bold"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>
          ))}
        </select>
      </label>
      {error && <p className="text-accent-danger font-body font-bold">{error}</p>}
    </div>
  );
}
