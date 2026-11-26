import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { cn } from './cn';

export interface TabDef {
  id: string;
  label: string;
  count?: number;
  icon?: ReactNode;
}

/** Abas guardadas na URL (?aba=...), com navegação por setas. */
export function useTab(tabs: TabDef[], key = 'aba') {
  const [params, setParams] = useSearchParams();
  const current = tabs.find((t) => t.id === params.get(key))?.id ?? tabs[0].id;
  const select = (id: string) => {
    const p = new URLSearchParams(params);
    p.set(key, id);
    setParams(p, { replace: true });
  };
  return [current, select] as const;
}

export function Tabs({ tabs, current, onSelect, label }: { tabs: TabDef[]; current: string; onSelect: (id: string) => void; label: string }) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + tabs.length) % tabs.length;
    refs.current[n]?.focus();
    onSelect(tabs[n].id);
  };
  return (
    <div role="tablist" aria-label={label} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
      {tabs.map((t, i) => {
        const on = t.id === current;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={on}
            aria-controls={`painel-${t.id}`}
            tabIndex={on ? 0 : -1}
            onClick={() => onSelect(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              'flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition',
              on ? 'bg-primary text-cream' : 'bg-white text-primary hover:bg-peach-soft',
            )}
          >
            {t.icon}
            {t.label}
            {t.count ? (
              <span className={cn('rounded-full px-1.5 text-xs', on ? 'bg-cream text-primary' : 'bg-orange text-primary')}>{t.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div role="tabpanel" id={`painel-${id}`} aria-labelledby={`tab-${id}`} tabIndex={0} className="mt-6 focus-visible:outline-none">
      {children}
    </div>
  );
}
