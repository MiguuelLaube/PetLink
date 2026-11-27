import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { ongProfileSchema, UF, type Ong } from '@/schemas';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { PhotoPicker } from '@/components/forms/PhotoPicker';
import { useUpdateOngProfile } from './hooks';

const schema = ongProfileSchema.omit({ cnpj: true });

export function ProfileTab({ ong }: { ong: Ong }) {
  const upd = useUpdateOngProfile();
  const [logo, setLogo] = useState<File[]>([]);
  const [current, setCurrent] = useState(ong.logoUrl ? [ong.logoUrl] : []);
  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: ong.name, email: ong.email, phone: ong.phone, address: ong.address, city: ong.city, state: ong.state, description: ong.description, logoUrl: ong.logoUrl },
  });
  return (
    <form noValidate onSubmit={handleSubmit((data) => upd.mutate({ data: { ...data, logoUrl: current[0] ?? '' }, logo: logo[0] }))} className="grid gap-4 rounded-block bg-white/80 p-6 shadow-soft sm:grid-cols-2 sm:p-8">
      <Input label="Nome da ONG" required error={errors.name?.message} {...register('name')} />
      <Input label="CNPJ" value={ong.cnpj} disabled hint="Para alterar o CNPJ, fale com a equipe PetLink." readOnly />
      <Input label="E-mail público" type="email" required error={errors.email?.message} {...register('email')} />
      <Input label="Telefone / WhatsApp" type="tel" required error={errors.phone?.message} {...register('phone')} />
      <Input label="Endereço" required className="sm:col-span-2" error={errors.address?.message} {...register('address')} />
      <Input label="Cidade" required error={errors.city?.message} {...register('city')} />
      <Select label="UF" required options={UF} error={errors.state?.message} {...register('state')} />
      <Textarea label="Sobre a ONG" required rows={4} className="sm:col-span-2" error={errors.description?.message} {...register('description')} />
      <div className="sm:col-span-2">
        <PhotoPicker label="Logo" max={1} files={logo} onChange={setLogo} existing={current} onRemoveExisting={() => setCurrent([])} />
      </div>
      <Button type="submit" loading={upd.isPending} className="sm:justify-self-start">Salvar perfil</Button>
    </form>
  );
}
