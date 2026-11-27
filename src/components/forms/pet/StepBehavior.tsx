import { useWatch } from 'react-hook-form';
import { ENERGY, YES_NO_UNKNOWN } from '@/schemas';
import { Checkbox, Select, Textarea } from '@/components/ui/Field';
import type { PetFormApi } from './types';

export function StepBehavior({ form }: { form: PetFormApi }) {
  const { register, control, formState: { errors } } = form;
  const special = useWatch({ control, name: 'specialNeeds' });
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Select label="Convive com crianças?" required options={YES_NO_UNKNOWN} error={errors.comportamento?.criancas?.message} {...register('comportamento.criancas')} />
      <Select label="Convive com outros animais?" required options={YES_NO_UNKNOWN} error={errors.comportamento?.outrosAnimais?.message} {...register('comportamento.outrosAnimais')} />
      <Select label="Nível de energia" required options={ENERGY} error={errors.comportamento?.energia?.message} {...register('comportamento.energia')} />
      <Checkbox className="sm:col-span-3" label="Tem necessidades especiais (deficiência, doença crônica, dieta, medicação)" {...register('specialNeeds')} />
      {special && (
        <Textarea label="Quais cuidados?" className="sm:col-span-3" rows={3} error={errors.specialNeedsDetails?.message} {...register('specialNeedsDetails')} />
      )}
    </div>
  );
}
