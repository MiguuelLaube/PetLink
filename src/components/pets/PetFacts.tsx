import { Baby, Cat, Cpu, Scissors, Sparkles, Zap } from 'lucide-react';
import { formatDate } from '@/lib/dates';
import type { Pet } from '@/schemas';

export function PetFacts({ pet }: { pet: Pet }) {
  const facts = [
    { icon: Scissors, label: 'Castração', value: pet.castrated ? (pet.dataCastracao ? `Castrado(a) em ${formatDate(pet.dataCastracao)}` : 'Castrado(a)') : 'Ainda não castrado(a)' },
    { icon: Cpu, label: 'Microchip', value: pet.microchip ? pet.microchip : 'Sem microchip' },
    { icon: Baby, label: 'Com crianças', value: pet.comportamento.criancas },
    { icon: Cat, label: 'Com outros animais', value: pet.comportamento.outrosAnimais },
    { icon: Zap, label: 'Nível de energia', value: pet.comportamento.energia },
  ];
  return (
    <div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 rounded-card bg-white p-4 shadow-soft">
            <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-blue text-primary">
              <Icon className="size-4" />
            </span>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</dt>
              <dd className="font-medium text-text">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
      {pet.specialNeeds && (
        <div className="mt-4 flex gap-3 rounded-card bg-info-soft p-4 text-info">
          <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0" />
          <p>
            <strong>Necessidades especiais:</strong> {pet.specialNeedsDetails || 'Converse com a ONG para saber os cuidados.'}
          </p>
        </div>
      )}
    </div>
  );
}
