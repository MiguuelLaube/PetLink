import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Stamp } from './Stamp';
import { cn } from './cn';

/** Título de seção no estilo da referência: Anton enorme + selo + frase cursiva. */
export function SectionTitle({
  children,
  stamp,
  script,
  as: Tag = 'h2',
  className,
  align = 'left',
  id,
}: {
  children: ReactNode;
  stamp?: string;
  script?: string;
  as?: 'h1' | 'h2';
  className?: string;
  align?: 'left' | 'center';
  id?: string;
}) {
  return (
    <div className={cn('relative', align === 'center' && 'text-center', className)}>
      <Tag id={id} className="text-h1 relative inline-block max-w-[14ch] text-balance">
        {children}
        {stamp && (
          <Stamp className={cn('absolute whitespace-nowrap', align === 'center' ? '-right-4 -top-4 sm:-right-14' : '-bottom-3 -right-6 sm:-right-10')}>{stamp}</Stamp>
        )}
      </Tag>
      {script && (
        <p aria-hidden className={cn('script-note mt-3 text-xl sm:text-2xl', align === 'center' && 'mx-auto')}>
          {script}
        </p>
      )}
    </div>
  );
}

/** Fade/slide sutil na entrada (respeita prefers-reduced-motion). */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
