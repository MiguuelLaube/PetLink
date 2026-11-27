import { useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Checkbox, Input } from '@/components/ui/Field';
import { DoseBadge } from '@/components/pets/VaccineTable';
import type { PetFormApi } from './types';

function ListShell({ title, onAdd, children, empty }: { title: string; onAdd: () => void; children: React.ReactNode; empty: boolean }) {
  return (
    <fieldset className="rounded-card bg-white p-4">
      <legend className="sr-only">{title}</legend>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold text-primary">{title}</p>
        <Button size="sm" variant="secondary" icon={<Plus className="size-4" />} onClick={onAdd}>
          Adicionar
        </Button>
      </div>
      {empty ? <p className="text-sm text-text-muted">Nenhum registro.</p> : <div className="grid gap-3">{children}</div>}
    </fieldset>
  );
}

function RemoveBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="grid size-11 place-items-center self-end rounded-full text-danger hover:bg-danger-soft">
      <Trash2 className="size-4" />
    </button>
  );
}

export function StepHealth({ form }: { form: PetFormApi }) {
  const { register, control, formState: { errors } } = form;
  const vac = useFieldArray({ control, name: 'vacinas' });
  const ver = useFieldArray({ control, name: 'vermifugacoes' });
  const exa = useFieldArray({ control, name: 'exames' });
  const [vacinas, vermifugacoes, castrated] = useWatch({ control, name: ['vacinas', 'vermifugacoes', 'castrated'] });

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Checkbox label="Castrado(a)" className="self-center" {...register('castrated')} />
        <Input label="Data da castração" type="date" disabled={!castrated} error={errors.dataCastracao?.message} {...register('dataCastracao')} />
        <Input label="Microchip" placeholder="Número do chip" error={errors.microchip?.message} {...register('microchip')} />
      </div>

      <ListShell title="Vacinas" empty={!vac.fields.length} onAdd={() => vac.append({ nome: '', dataAplicada: '', proximoReforco: '' })}>
        {vac.fields.map((f, i) => (
          <div key={f.id} className="grid items-end gap-2 sm:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
            <Input label="Vacina" error={errors.vacinas?.[i]?.nome?.message} {...register(`vacinas.${i}.nome`)} />
            <Input label="Aplicada em" type="date" error={errors.vacinas?.[i]?.dataAplicada?.message} {...register(`vacinas.${i}.dataAplicada`)} />
            <Input label="Próximo reforço" type="date" {...register(`vacinas.${i}.proximoReforco`)} />
            <span className="pb-3"><DoseBadge next={vacinas?.[i]?.proximoReforco} /></span>
            <RemoveBtn onClick={() => vac.remove(i)} label={`Remover vacina ${i + 1}`} />
          </div>
        ))}
      </ListShell>

      <ListShell title="Vermifugação" empty={!ver.fields.length} onAdd={() => ver.append({ produto: '', data: '', proximo: '' })}>
        {ver.fields.map((f, i) => (
          <div key={f.id} className="grid items-end gap-2 sm:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
            <Input label="Produto" error={errors.vermifugacoes?.[i]?.produto?.message} {...register(`vermifugacoes.${i}.produto`)} />
            <Input label="Data" type="date" error={errors.vermifugacoes?.[i]?.data?.message} {...register(`vermifugacoes.${i}.data`)} />
            <Input label="Próxima dose" type="date" {...register(`vermifugacoes.${i}.proximo`)} />
            <span className="pb-3"><DoseBadge next={vermifugacoes?.[i]?.proximo} /></span>
            <RemoveBtn onClick={() => ver.remove(i)} label={`Remover vermifugação ${i + 1}`} />
          </div>
        ))}
      </ListShell>

      <ListShell title="Exames" empty={!exa.fields.length} onAdd={() => exa.append({ nome: '', data: '', resultado: '' })}>
        {exa.fields.map((f, i) => (
          <div key={f.id} className="grid items-end gap-2 sm:grid-cols-[1.2fr_1fr_1.4fr_auto]">
            <Input label="Exame" error={errors.exames?.[i]?.nome?.message} {...register(`exames.${i}.nome`)} />
            <Input label="Data" type="date" error={errors.exames?.[i]?.data?.message} {...register(`exames.${i}.data`)} />
            <Input label="Resultado" error={errors.exames?.[i]?.resultado?.message} {...register(`exames.${i}.resultado`)} />
            <RemoveBtn onClick={() => exa.remove(i)} label={`Remover exame ${i + 1}`} />
          </div>
        ))}
      </ListShell>
    </div>
  );
}
