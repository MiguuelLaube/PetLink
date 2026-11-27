import type { ReactNode } from 'react';
import { cn } from './cn';

export function StatCard({ label, value, tone = 'bg-white', icon }: { label: string; value: number | string; tone?: string; icon?: ReactNode }) {
  return (
    <div className={cn('rounded-card p-5 shadow-soft', tone)}>
      <div className="flex items-center justify-between text-primary">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className="mt-2 font-display text-5xl leading-none text-primary">{value}</p>
    </div>
  );
}
