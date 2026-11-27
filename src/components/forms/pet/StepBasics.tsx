import { AGE_GROUPS, GENDERS, SIZES, SPECIES, UF } from '@/schemas';
import { Input, Select, Textarea } from '@/components/ui/Field';
import type { PetFormApi } from './types';

export function StepBasics({ form }: { form: PetFormApi }) {
  const { register, formState: { errors } } = form;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="Nome" required error={errors.name?.message} {...register('name')} />
      <Input label="Raça" hint="Use SRD para sem raça definida." error={errors.breed?.message} {...register('breed')} />
      <Select label="Espécie" required options={SPECIES} placeholder="Escolha" error={errors.species?.message} {...register('species')} />
      <Select label="Sexo" required options={GENDERS} placeholder="Escolha" error={errors.gender?.message} {...register('gender')} />
      <Input label="Idade aproximada" required placeholder="Ex.: 2 anos" error={errors.age?.message} {...register('age')} />
      <Select label="Faixa etária" required options={AGE_GROUPS} placeholder="Escolha" error={errors.ageGroup?.message} {...register('ageGroup')} />
      <Select label="Porte" required options={SIZES} placeholder="Escolha" error={errors.size?.message} {...register('size')} />
      <Input label="Cor / pelagem" error={errors.color?.message} {...register('color')} />
      <Input label="Cidade" required error={errors.city?.message} {...register('city')} />
      <Select label="UF" required options={UF} placeholder="Escolha" error={errors.state?.message} {...register('state')} />
      <Textarea label="Descrição" required className="sm:col-span-2" rows={5} hint="Personalidade, história e do que ele(a) gosta. É o que mais ajuda na adoção." error={errors.description?.message} {...register('description')} />
    </div>
  );
}
