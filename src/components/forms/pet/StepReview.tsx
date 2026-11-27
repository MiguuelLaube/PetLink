import { useWatch } from 'react-hook-form';
import type { PetFormApi } from './types';

export function StepReview({ form, photos }: { form: PetFormApi; photos: number }) {
  const v = useWatch({ control: form.control });
  const rows: Array<[string, string]> = [
    ['Nome', v.name ?? ''],
    ['Espécie / sexo / porte', [v.species, v.gender, v.size].filter(Boolean).join(' · ')],
    ['Idade', `${v.age ?? ''} (${v.ageGroup ?? ''})`],
    ['Local', `${v.city ?? ''}/${v.state ?? ''}`],
    ['Castração', v.castrated ? `Sim${v.dataCastracao ? `, em ${v.dataCastracao}` : ''}` : 'Não'],
    ['Vacinas / vermifugações / exames', `${v.vacinas?.length ?? 0} / ${v.vermifugacoes?.length ?? 0} / ${v.exames?.length ?? 0}`],
    ['Comportamento', `Crianças: ${v.comportamento?.criancas} · Animais: ${v.comportamento?.outrosAnimais} · Energia: ${v.comportamento?.energia}`],
    ['Necessidades especiais', v.specialNeeds ? v.specialNeedsDetails || 'Sim' : 'Não'],
    ['Fotos', String(photos)],
  ];
  return (
    <div className="grid gap-4">
      <p role="note" className="rounded-card bg-warning-soft p-4 text-sm font-medium text-warning">
        Ao salvar, a ficha fica <strong>Em análise</strong> e só aparece no catálogo depois que a equipe PetLink aprovar.
      </p>
      <dl className="divide-y divide-line rounded-card bg-white">
        {rows.map(([k, val]) => (
          <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr]">
            <dt className="text-sm font-semibold text-primary">{k}</dt>
            <dd className="text-sm">{val || '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
