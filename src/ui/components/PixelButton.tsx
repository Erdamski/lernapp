import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'success' | 'danger' | 'coin' | 'magic' | 'ghost';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

/**
 * Chunky Pixel-Button mit hartem 3D-Schatten und Press-Effekt.
 * Siehe STYLEGUIDE §3.
 */
export default function PixelButton({
  variant = 'primary',
  size = 'md',
  full = false,
  children,
  iconLeft,
  iconRight,
  className = '',
  ...rest
}: Props) {
  const sizeClasses = {
    sm: 'h-10 px-3 text-[10px]',
    md: 'h-14 px-5 text-[14px]',
    lg: 'h-20 px-8 text-[18px]',
    icon: 'w-14 h-14 p-0 text-[12px]',
  }[size];

  const v = VARIANTS[variant];

  return (
    <button
      {...rest}
      className={[
        'pixel-btn',
        sizeClasses,
        full ? 'w-full' : '',
        v.bg,
        v.text,
        v.border,
        v.shadowColor,
        'shadow-pixel-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {iconLeft && <span className="inline-flex">{iconLeft}</span>}
      {children}
      {iconRight && <span className="inline-flex">{iconRight}</span>}
    </button>
  );
}

const VARIANTS: Record<Variant, { bg: string; text: string; border: string; shadowColor: string }> = {
  primary: {
    bg: 'bg-primary-500 hover:bg-primary-400',
    text: 'text-white',
    border: 'border-ink',
    shadowColor: 'shadow-ink-soft',
  },
  success: {
    bg: 'bg-accent-success hover:bg-emerald-400',
    text: 'text-white',
    border: 'border-ink',
    shadowColor: 'shadow-emerald-900',
  },
  danger: {
    bg: 'bg-accent-danger hover:bg-red-400',
    text: 'text-white',
    border: 'border-ink',
    shadowColor: 'shadow-red-900',
  },
  coin: {
    bg: 'bg-accent-coin hover:bg-amber-300',
    text: 'text-ink',
    border: 'border-ink',
    shadowColor: 'shadow-amber-700',
  },
  magic: {
    bg: 'bg-accent-magic hover:bg-purple-400',
    text: 'text-white',
    border: 'border-ink',
    shadowColor: 'shadow-purple-900',
  },
  ghost: {
    bg: 'bg-bg-card hover:bg-bg-mid',
    text: 'text-white',
    border: 'border-ink-soft',
    shadowColor: 'shadow-black',
  },
};
