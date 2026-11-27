import { useId, useState } from 'react';

export interface Datum {
  label: string;
  value: number;
}

const niceMax = (n: number) => (n <= 4 ? 4 : Math.ceil(n / 4) * 4);

/**
 * Colunas de série única (sem legenda: o título nomeia a série).
 * Barras de até 24px, ponta arredondada de 4px, grade hairline, tooltip no hover/foco e tabela acessível.
 */
export function ColumnChart({ title, data, unit }: { title: string; data: Datum[]; unit: string }) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  const H = 180;
  return (
    <figure aria-labelledby={`${id}-t`} className="rounded-card bg-white p-5 shadow-soft">
      <figcaption id={`${id}-t`} className="font-semibold text-primary">{title}</figcaption>
      <div className="relative mt-4 flex gap-2" style={{ height: H + 24 }}>
        <div aria-hidden className="relative w-6 shrink-0 text-right text-[0.7rem] text-text-muted" style={{ height: H }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: H - (t / max) * H }}>{t}</span>
          ))}
        </div>
        <div className="relative flex-1" style={{ height: H }}>
          {ticks.map((t) => (
            <span key={t} aria-hidden className="absolute inset-x-0 h-px bg-grid" style={{ top: H - (t / max) * H }} />
          ))}
          <ul className="absolute inset-0 flex items-end justify-around" aria-hidden>
            {data.map((d, i) => (
              <li
                key={d.label}
                className="relative flex h-full w-full flex-col items-center justify-end"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {hover === i && (
                  <span className="absolute z-10 -translate-y-2 whitespace-nowrap rounded-lg bg-primary px-2.5 py-1.5 text-xs text-cream shadow-soft" style={{ bottom: (d.value / max) * H }}>
                    {d.label}: <strong>{d.value}</strong> {unit}
                  </span>
                )}
                <span className="w-full max-w-6 rounded-t-[4px] bg-chart transition-opacity" style={{ height: Math.max(d.value ? 2 : 0, (d.value / max) * H), opacity: hover === null || hover === i ? 1 : 0.55 }} />
                <span className="absolute -bottom-6 text-[0.7rem] text-text-muted">{d.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <DataTable title={title} data={data} unit={unit} />
    </figure>
  );
}

/** Barras horizontais de série única com valor direto ao final (poucas categorias). */
export function BarList({ title, data, unit }: { title: string; data: Datum[]; unit: string }) {
  const id = useId();
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <figure aria-labelledby={`${id}-t`} className="rounded-card bg-white p-5 shadow-soft">
      <figcaption id={`${id}-t`} className="font-semibold text-primary">{title}</figcaption>
      <ul className="mt-4 grid gap-3">
        {data.map((d) => (
          <li key={d.label} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-sm" title={`${d.label}: ${d.value} ${unit}`}>
            <span className="text-text">{d.label}</span>
            <span className="h-5 rounded-r-[4px] bg-grid">
              <span className="block h-full rounded-r-[4px] bg-chart" style={{ width: `${(d.value / max) * 100}%` }} />
            </span>
            <span className="text-right font-semibold text-text">{d.value}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

function DataTable({ title, data, unit }: { title: string; data: Datum[]; unit: string }) {
  return (
    <details className="mt-6 text-sm">
      <summary className="cursor-pointer font-semibold text-primary">Ver tabela</summary>
      <table className="mt-2 w-full text-left">
        <caption className="sr-only">{title}</caption>
        <thead><tr><th scope="col" className="py-1">Mês</th><th scope="col" className="py-1 text-right">{unit}</th></tr></thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label} className="border-t border-line"><th scope="row" className="py-1 font-normal">{d.label}</th><td className="py-1 text-right">{d.value}</td></tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
