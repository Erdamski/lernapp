import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PixelIcon from './PixelIcon';

interface Props {
  title: string;
  expectedPin?: string;          // Wenn gesetzt: Eingabe muss matchen
  pinLength?: number;
  onSuccess: (pin: string) => void;
  onCancel?: () => void;
  /** Wenn true, ist es ein Setup-Pad: zwei Eingaben hintereinander */
  setupMode?: boolean;
}

export default function PinPad({ title, expectedPin, pinLength = 4, onSuccess, onCancel, setupMode = false }: Props) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [firstSetupPin, setFirstSetupPin] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitWhenFull = (next: string) => {
    if (next.length === pinLength) {
      if (setupMode) {
        if (!firstSetupPin) {
          setFirstSetupPin(next);
          setPin('');
        } else if (firstSetupPin === next) {
          onSuccess(next);
        } else {
          setError('PINs stimmen nicht');
          setFirstSetupPin(null);
          setPin('');
        }
      } else {
        if (next === expectedPin) onSuccess(next);
        else {
          setError(t('pin.wrong'));
          setTimeout(() => {
            setError(null);
            setPin('');
          }, 800);
        }
      }
    }
  };

  const press = (digit: string) => {
    if (pin.length >= pinLength) return;
    const next = pin + digit;
    setPin(next);
    setError(null);
    submitWhenFull(next);
  };

  const erase = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="card-tile bg-slate-800 p-6 max-w-sm w-full">
        <h2 className="text-2xl font-display mb-1 text-center">{title}</h2>
        {setupMode && firstSetupPin && <p className="text-sm text-white/60 text-center mb-4">PIN bestätigen</p>}

        <div className="flex justify-center gap-3 my-6">
          {Array.from({ length: pinLength }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full border-2 ${pin.length > i ? 'bg-primary-500 border-primary-500' : 'border-white/40'}`}
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}

        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => press(d)}
              className="pixel-btn bg-bg-card hover:bg-primary-500/40 border-ink-soft shadow-black shadow-pixel-sm w-full aspect-square text-3xl text-white"
            >
              {d}
            </button>
          ))}
          <button onClick={onCancel} className="pixel-btn bg-bg-mid border-ink-soft shadow-black shadow-pixel-sm w-full aspect-square text-2xl">
            <PixelIcon name="cross" size={24} tone="white" />
          </button>
          <button onClick={() => press('0')} className="pixel-btn bg-bg-card hover:bg-primary-500/40 border-ink-soft shadow-black shadow-pixel-sm w-full aspect-square text-3xl text-white">
            0
          </button>
          <button onClick={erase} className="pixel-btn bg-bg-mid border-ink-soft shadow-black shadow-pixel-sm w-full aspect-square text-xl">
            <PixelIcon name="arrow-left" size={20} tone="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
