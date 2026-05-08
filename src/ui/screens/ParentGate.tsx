import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '@engine/db/schema';
import PinPad from '@ui/components/PinPad';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Eltern-Bereich-Eingang.
 * Beim ersten Mal: Setup eines neuen Eltern-PINs.
 * Danach: PIN-Abfrage.
 */
export default function ParentGate({ onSuccess, onCancel }: Props) {
  const { t } = useTranslation();
  const [setupMode, setSetupMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [existingPin, setExistingPin] = useState<string | undefined>(undefined);

  useEffect(() => {
    db.settings.get('singleton').then((s) => {
      if (!s || !s.parentPin) {
        setSetupMode(true);
      } else {
        setExistingPin(s.parentPin);
      }
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <PinPad
      title={setupMode ? t('pin.set_title') : t('parent.gate_title')}
      expectedPin={existingPin}
      setupMode={setupMode}
      onSuccess={async (pin) => {
        if (setupMode) {
          const existing = (await db.settings.get('singleton')) ?? {
            id: 'singleton' as const,
            defaultLanguage: 'de' as const,
            maxPlayMinutesPerDay: 20,
            audioEnabled: true,
            musicEnabled: true,
          };
          await db.settings.put({ ...existing, parentPin: pin });
        }
        onSuccess();
      }}
      onCancel={onCancel}
    />
  );
}
