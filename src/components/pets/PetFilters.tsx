import { AGE_GROUPS, GENDERS, SIZES, SPECIES, UF } from '@/schemas';
import { ChipGroup, Checkbox, Input, Select } from '@/components/ui/Field';
import { countActiveFilters, EMPTY_FILTERS, type PetFilters as Filters } from '@/lib/filters';

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
}

export function PetFilters({ value, onChange }: Props) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...value, [k]: v });
  const active = countActiveFilters(value);
  return (
    <div className="flex flex-col gap-6">
      <ChipGroup legend="Espécie" options={SPECIES} value={value.especie} onChange={(v) => set('especie', v)} />
      <ChipGroup legend="Porte" options={SIZES} value={value.porte} onChange={(v) => set('porte', v)} />
      <ChipGroup legend="Idade" options={AGE_GROUPS} value={value.idade} onChange={(v) => set('idade', v)} />
      <ChipGroup legend="Sexo" options={GENDERS} value={value.sexo} onChange={(v) => set('sexo', v)} />
      <div className="grid grid-cols-[6rem_1fr] gap-3">
        <Select label="UF" value={value.uf} onChange={(e) => set('uf', e.target.value)} options={UF} placeholder="Todas" />
        <Input label="Cidade" value={value.cidade} onChange={(e) => set('cidade', e.target.value)} placeholder="Ex.: Campinas" />
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-semibold text-primary">Mais opções</legend>
        <Checkbox label="Só castrados" checked={value.castrado} onChange={(e) => set('castrado', e.target.checked)} />
        <Checkbox label="Com necessidades especiais" checked={value.especiais} onChange={(e) => set('especiais', e.target.checked)} />
        <Checkbox label="Meus favoritos" checked={value.favoritos} onChange={(e) => set('favoritos', e.target.checked)} />
      </fieldset>
      {active > 0 && (
        <button
          type="button"
          onClick={() => onChange({ ...EMPTY_FILTERS, q: value.q, ordem: value.ordem })}
          className="self-start text-sm font-semibold text-primary underline underline-offset-4"
        >
          Limpar {active} {active === 1 ? 'filtro' : 'filtros'}
        </button>
      )}
    </div>
  );
}
