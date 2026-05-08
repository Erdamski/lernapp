import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'white' | 'gold' | 'primary' | 'success';
  className?: string;
}

/**
 * Pixel-Headline mit hartem Schatten. Press-Start-2P-Schrift, uppercase.
 * Siehe STYLEGUIDE §2.
 */
export default function PixelTitle({ children, size = 'md', color = 'white', className = '' }: Props) {
  const sizeClass = {
    sm: 'text-[12px] leading-[1.6]',
    md: 'text-[18px] leading-[1.6]',
    lg: 'text-[28px] leading-[1.4]',
    xl: 'text-[40px] leading-[1.3]',
  }[size];

  const colorClass = {
    white: 'text-white',
    gold: 'text-accent-coin',
    primary: 'text-primary-400',
    success: 'text-accent-success',
  }[color];

  return (
    <h1 className={`pixel-headline ${sizeClass} ${colorClass} ${className}`}>
      {children}
    </h1>
  );
}
