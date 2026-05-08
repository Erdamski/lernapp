import { useMemo, useState } from 'react';
import PixelCharacter from '@ui/components/PixelCharacter';
import PixelButton from '@ui/components/PixelButton';
import PixelIcon, { type IconName } from '@ui/components/PixelIcon';
import PixelTitle from '@ui/components/PixelTitle';
import IconButton from '@ui/components/IconButton';
import {
  BOTTOM_TYPE_LABELS,
  BOTTOM_TYPE_OPTIONS,
  CLOTH_COLOR_OPTIONS,
  CLOTH_COLORS,
  EQUIPMENT_LABELS,
  EQUIPMENT_OPTIONS,
  getDefaultCharacter,
  HAIR_COLOR_OPTIONS,
  HAIR_COLORS,
  HAIR_LABELS,
  HAIR_OPTIONS,
  SHOE_LABELS,
  SHOE_OPTIONS,
  SKIN_COLORS,
  SKIN_OPTIONS,
  TOP_TYPE_LABELS,
  TOP_TYPE_OPTIONS,
  type BottomType,
  type CharacterConfig,
  type ClothColor,
  type EquipmentId,
  type HairColorId,
  type HairId,
  type ShoeId,
  type SkinId,
  type TopType,
} from '@engine/avatar/character';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@i18n/init';

type Category = 'skin' | 'hair' | 'top' | 'bottom' | 'shoe' | 'equipment' | 'details';

interface CategoryDef {
  id: Category;
  label: string;
  icon: IconName;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'skin', label: 'HAUTFARBE', icon: 'skin' },
  { id: 'hair', label: 'FRISUR', icon: 'hair' },
  { id: 'top', label: 'OBERTEIL', icon: 'shirt' },
  { id: 'bottom', label: 'HOSE', icon: 'pants' },
  { id: 'shoe', label: 'SCHUHE', icon: 'home' },
  { id: 'equipment', label: 'AUSRÜSTUNG', icon: 'gear' },
];

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

export default function CharacterWizard(props: Props) {
  const isEdit = props.mode === 'edit';
  const initial = isEdit ? props.initialCharacter : getDefaultCharacter();
  const [character, setCharacter] = useState<CharacterConfig>(initial);

  const STEPS = useMemo<Category[]>(
    () => (isEdit ? CATEGORIES.map((c) => c.id) : [...CATEGORIES.map((c) => c.id), 'details']),
    [isEdit],
  );
  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = STEPS[stepIdx];

  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [language, setLanguage] = useState<SupportedLanguage>('de');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepLabel =
    currentStep === 'details'
      ? 'DEIN NAME'
      : CATEGORIES.find((c) => c.id === currentStep)!.label;
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

  const jumpTo = (cat: Category) => {
    const idx = STEPS.indexOf(cat);
    if (idx >= 0) setStepIdx(idx);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-bg-deep">
      {/* Top-Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b-4 border-ink bg-bg-mid/80">
        <IconButton onClick={goBack} disabled={submitting}>
          <PixelIcon name="arrow-left" size={26} tone="white" />
        </IconButton>
        <PixelTitle size="md">{stepLabel}</PixelTitle>
        <div className="font-pixel text-[12px] text-white/60 w-14 text-right">
          {stepIdx + 1}/{STEPS.length}
        </div>
      </header>

      {/* 3-Spalten-Body (auf Mobile gestapelt).
          Mobile: gesamtes <main> scrollt. Desktop: nur die Optionen-Spalte scrollt. */}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Kategorien-Sidebar (oben auf Mobile) */}
        <aside className="lg:w-56 lg:border-r-4 border-b-4 lg:border-b-0 border-ink bg-bg-mid/40 overflow-x-auto lg:overflow-y-auto shrink-0">
          <ul className="flex lg:flex-col gap-2 p-3 min-w-max lg:min-w-0">
            {STEPS.map((stepId, i) => {
              const def = CATEGORIES.find((c) => c.id === stepId);
              const label = stepId === 'details' ? 'NAME' : def?.label;
              const icon: IconName = stepId === 'details' ? 'gear' : def?.icon ?? 'gear';
              const active = stepIdx === i;
              const passed = i < stepIdx;
              return (
                <li key={stepId}>
                  <button
                    onClick={() => jumpTo(stepId)}
                    className={`pixel-btn border-ink shadow-pixel-sm h-12 px-3 flex items-center gap-2 w-full
                      ${active
                        ? 'bg-primary-500 shadow-ink-soft'
                        : passed
                          ? 'bg-emerald-700 shadow-emerald-900'
                          : 'bg-bg-card shadow-black hover:bg-bg-mid'}`}
                  >
                    <PixelIcon name={passed ? 'check' : icon} size={18} tone="white" />
                    <span className="font-pixel text-[10px] text-white whitespace-nowrap">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Live-Preview Center */}
        <section className="flex items-center justify-center p-6 lg:flex-1 lg:min-w-0 bg-bg-deep shrink-0">
          <div className="rounded-chunk p-4 bg-gradient-to-b from-indigo-700 to-indigo-900 shadow-pixel-md shadow-ink">
            <PixelCharacter config={character} size={360} bg={null} />
          </div>
        </section>

        {/* Optionen rechts (oder unten auf Mobile).
            Auf Desktop: feste Breite, eigener Scroll. Auf Mobile: volle Breite, kein eigener Scroll
            (Parent <main> scrollt). */}
        <section className="lg:w-[420px] lg:border-l-4 border-t-4 lg:border-t-0 border-ink bg-bg-mid/30 lg:overflow-y-auto p-5 pb-10">
          {currentStep === 'skin' && (
            <Section title="FARBE">
              <PreviewGrid
                options={SKIN_OPTIONS.map((id) => ({
                  id,
                  label: SKIN_COLORS[id].label.toUpperCase(),
                  preview: <PixelCharacter config={{ ...character, skinId: id }} size={88} bg={null} crop="head" />,
                }))}
                value={character.skinId}
                onChange={(id) => setCharacter({ ...character, skinId: id as SkinId })}
              />
            </Section>
          )}

          {currentStep === 'hair' && (
            <>
              <Section title="TYP">
                <PreviewGrid
                  options={HAIR_OPTIONS.map((id) => ({
                    id,
                    label: HAIR_LABELS[id].toUpperCase(),
                    preview: <PixelCharacter config={{ ...character, hairId: id }} size={88} bg={null} crop="head" />,
                  }))}
                  value={character.hairId}
                  onChange={(id) => setCharacter({ ...character, hairId: id as HairId })}
                />
              </Section>
              <Section title="FARBE">
                <SwatchGrid
                  options={HAIR_COLOR_OPTIONS.map((id) => ({ id, label: HAIR_COLORS[id].label.toUpperCase(), color: HAIR_COLORS[id].fill }))}
                  value={character.hairColorId}
                  onChange={(id) => setCharacter({ ...character, hairColorId: id as HairColorId })}
                />
              </Section>
            </>
          )}

          {currentStep === 'top' && (
            <>
              <Section title="TYP">
                <PreviewGrid
                  options={TOP_TYPE_OPTIONS.map((id) => ({
                    id,
                    label: TOP_TYPE_LABELS[id].toUpperCase(),
                    preview: <PixelCharacter config={{ ...character, topTypeId: id }} size={88} bg={null} crop="top" />,
                  }))}
                  value={character.topTypeId}
                  onChange={(id) => setCharacter({ ...character, topTypeId: id as TopType })}
                />
              </Section>
              <Section title="FARBE">
                <SwatchGrid
                  options={CLOTH_COLOR_OPTIONS.map((id) => ({ id, label: CLOTH_COLORS[id].label.toUpperCase(), color: CLOTH_COLORS[id].fill }))}
                  value={character.topColorId}
                  onChange={(id) => setCharacter({ ...character, topColorId: id as ClothColor })}
                />
              </Section>
            </>
          )}

          {currentStep === 'bottom' && (
            <>
              <Section title="TYP">
                <PreviewGrid
                  options={BOTTOM_TYPE_OPTIONS.map((id) => ({
                    id,
                    label: BOTTOM_TYPE_LABELS[id].toUpperCase(),
                    preview: <PixelCharacter config={{ ...character, bottomTypeId: id }} size={88} bg={null} crop="bottom" />,
                  }))}
                  value={character.bottomTypeId}
                  onChange={(id) => setCharacter({ ...character, bottomTypeId: id as BottomType })}
                />
              </Section>
              <Section title="FARBE">
                <SwatchGrid
                  options={CLOTH_COLOR_OPTIONS.map((id) => ({ id, label: CLOTH_COLORS[id].label.toUpperCase(), color: CLOTH_COLORS[id].fill }))}
                  value={character.bottomColorId}
                  onChange={(id) => setCharacter({ ...character, bottomColorId: id as ClothColor })}
                />
              </Section>
            </>
          )}

          {currentStep === 'shoe' && (
            <Section title="TYP">
              <PreviewGrid
                options={SHOE_OPTIONS.map((id) => ({
                  id,
                  label: SHOE_LABELS[id].toUpperCase(),
                  preview: <PixelCharacter config={{ ...character, shoeId: id }} size={88} bg={null} crop="shoe" />,
                }))}
                value={character.shoeId}
                onChange={(id) => setCharacter({ ...character, shoeId: id as ShoeId })}
              />
            </Section>
          )}

          {currentStep === 'equipment' && (
            <Section title="TYP">
              <PreviewGrid
                options={EQUIPMENT_OPTIONS.map((id) => ({
                  id,
                  label: EQUIPMENT_LABELS[id].toUpperCase(),
                  preview: <PixelCharacter config={{ ...character, equipmentId: id }} size={88} bg={null} crop="equipment" />,
                }))}
                value={character.equipmentId}
                onChange={(id) => setCharacter({ ...character, equipmentId: id as EquipmentId })}
              />
            </Section>
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
        </section>
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
          iconRight={
            isLast ? <PixelIcon name="check" size={22} tone="white" /> : <PixelIcon name="arrow-right" size={22} tone="white" />
          }
        >
          {isLast ? (isEdit ? 'SPEICHERN' : 'SPIELEN') : 'WEITER'}
        </PixelButton>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-pixel text-[11px] text-white/60 mb-3">{title}</h3>
      {children}
    </div>
  );
}

interface PreviewItem { id: string; label: string; preview: React.ReactNode }

function PreviewGrid({ options, value, onChange }: { options: PreviewItem[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-chunk p-2 flex flex-col items-center gap-1 transition-colors active:scale-95
            ${value === opt.id ? 'bg-primary-500 ring-4 ring-accent-coin' : 'bg-bg-card hover:bg-bg-mid'}`}
        >
          <div className="w-[88px] h-[88px] flex items-center justify-center">{opt.preview}</div>
          <span className="font-pixel text-[9px] text-white whitespace-nowrap">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

interface SwatchItem { id: string; label: string; color: string }

function SwatchGrid({ options, value, onChange }: { options: SwatchItem[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-chunk p-2 flex flex-col items-center gap-1 transition-colors active:scale-95
            ${value === opt.id ? 'bg-primary-500 ring-4 ring-accent-coin' : 'bg-bg-card hover:bg-bg-mid'}`}
        >
          <div className="w-16 h-16" style={{ background: opt.color }} />
          <span className="font-pixel text-[9px] text-white">{opt.label}</span>
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
    <div className="space-y-4">
      <label className="block">
        <span className="font-pixel text-[11px] text-white/60 uppercase">Name</span>
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          autoFocus
          placeholder="Dein Name"
          maxLength={20}
          style={INPUT_STYLE}
          className="mt-2 w-full text-2xl font-body font-bold"
        />
      </label>
      <label className="block">
        <span className="font-pixel text-[11px] text-white/60 uppercase">Alter</span>
        <input
          type="number"
          value={age}
          min={4}
          max={14}
          onChange={(e) => onAge(parseInt(e.target.value) || 6)}
          style={INPUT_STYLE}
          className="mt-2 w-full text-2xl font-body font-bold"
        />
      </label>
      <label className="block">
        <span className="font-pixel text-[11px] text-white/60 uppercase">Sprache</span>
        <select
          value={language}
          onChange={(e) => onLanguage(e.target.value as SupportedLanguage)}
          style={SELECT_STYLE}
          className="mt-2 w-full text-2xl font-body font-bold"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l} value={l} style={{ background: '#23264a', color: '#ffffff' }}>{LANGUAGE_LABELS[l]}</option>
          ))}
        </select>
      </label>
      {error && <p className="text-accent-danger font-body font-bold">{error}</p>}
    </div>
  );
}

const INPUT_STYLE: React.CSSProperties = {
  background: '#23264a',
  color: '#ffffff',
  border: '4px solid #1e1b4b',
  borderRadius: 6,
  padding: '12px 16px',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
};

const SELECT_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  // Dropdown-Pfeil als SVG, da appearance: none den nativen entfernt
  backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 16 16\'><polygon points=\'4,6 12,6 8,11\' fill=\'white\'/></svg>")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  paddingRight: 48,
};
