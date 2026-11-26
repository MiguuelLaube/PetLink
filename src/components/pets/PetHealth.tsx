import { formatDate } from '@/lib/dates';
import { overallDoseStatus, DOSE_STATUS_LABEL } from '@/lib/vaccineStatus';
import type { Pet } from '@/schemas';
import { DoseTable } from './VaccineTable';

export function PetHealth({ pet }: { pet: Pet }) {
  const overall = overallDoseStatus([...pet.vacinas.map((v) => v.proximoReforco), ...pet.vermifugacoes.map((v) => v.proximo)]);
  return (
    <div className="grid gap-6">
      <p className="text-sm text-text-muted">
        Situação geral hoje: <strong className="text-text">{DOSE_STATUS_LABEL[overall]}</strong>. O status é calculado pela data do próximo reforço.
      </p>
      <div>
        <h3 className="mb-3 font-semibold text-primary">Vacinas</h3>
        <DoseTable
          caption={`Vacinas de ${pet.name}`}
          rows={pet.vacinas.map((v) => ({ nome: v.nome, aplicada: v.dataAplicada, proximo: v.proximoReforco }))}
          emptyText="Nenhuma vacina registrada ainda."
        />
      </div>
      <div>
        <h3 className="mb-3 font-semibold text-primary">Vermifugação</h3>
        <DoseTable
          caption={`Vermifugações de ${pet.name}`}
          rows={pet.vermifugacoes.map((v) => ({ nome: v.produto, aplicada: v.data, proximo: v.proximo }))}
          emptyText="Nenhuma vermifugação registrada ainda."
        />
      </div>
      <div>
        <h3 className="mb-3 font-semibold text-primary">Exames</h3>
        {pet.exames.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {pet.exames.map((e) => (
              <li key={`${e.nome}-${e.data}`} className="rounded-card bg-white p-4 shadow-soft">
                <p className="font-medium text-text">{e.nome}</p>
                <p className="text-sm text-text-muted">
                  {formatDate(e.data)} · {e.resultado}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-card bg-white/60 p-4 text-sm text-text-muted">Nenhum exame registrado.</p>
        )}
      </div>
    </div>
  );
}
