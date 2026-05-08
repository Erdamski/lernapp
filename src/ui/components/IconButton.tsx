import { memo, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { sfx } from '@engine/audio/SoundPlayer';

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'coin' | 'danger';
  size?: number;       // Quadratisch
}

/**
 * Kompakter Icon-Button ohne White-Inset-Highlight (siehe STYLEGUIDE).
 * Border-loser Look für Header-Aktionen wie Zurück, Audio, Profil-Wechsel.
 */
export default memo(function IconButton({
  children,
  variant = 'default',
  size = 56,
  className = '',
  ...rest
}: Props) {
  const v = STYLES[variant];
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    sfx.buttonTap();
    rest.onClick?.(e);
  };
  return (
    <button
      {...rest}
      onClick={onClick}
      style={{ width: size, height: size, ...rest.style }}
      className={`pixel-btn ${v.bg} ${v.shadow} shadow-pixel-sm border-0 p-0 flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
});

const STYLES = {
  default: { bg: 'bg-bg-card hover:bg-bg-mid', shadow: 'shadow-ink' },
  primary: { bg: 'bg-primary-500 hover:bg-primary-400', shadow: 'shadow-ink-soft' },
  success: { bg: 'bg-accent-success hover:bg-emerald-400', shadow: 'shadow-emerald-900' },
  coin: { bg: 'bg-accent-coin hover:bg-amber-300', shadow: 'shadow-amber-700' },
  danger: { bg: 'bg-accent-danger hover:bg-red-400', shadow: 'shadow-red-900' },
} as const;
