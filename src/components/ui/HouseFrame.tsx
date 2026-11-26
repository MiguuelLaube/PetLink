import { cn } from './cn';

type Tone = 'yellow' | 'peach' | 'blue' | 'cream';
const tones: Record<Tone, string> = {
  yellow: 'bg-yellow-soft',
  peach: 'bg-peach',
  blue: 'bg-blue',
  cream: 'bg-bg',
};

interface Props {
  src: string;
  alt: string;
  tone?: Tone;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

/** Foto em moldura com formato de casinha (telhado via clip-path). */
export function HouseFrame({ src, alt, tone = 'yellow', className, imgClassName, eager }: Props) {
  return (
    <div className={cn('house-clip relative overflow-hidden', tones[tone], className)}>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('size-full object-cover', imgClassName)}
      />
    </div>
  );
}
