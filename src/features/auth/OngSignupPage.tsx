import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ongProfileSchema, passwordSchema, UF } from '@/schemas';
import { signUpOng } from '@/services/auth';
import { friendlyError } from '@/services/helpers';
import { formatCnpj } from '@/lib/cnpj';
import { useDocumentMeta } from '@/lib/seo';
import { Button } from '@/components/ui/Button';
import { Checkbox, Input, Select, Textarea } from '@/components/ui/Field';
import { AuthLayout } from './AuthLayout';
import { useAuth } from './AuthContext';

const schema = ongProfileSchema
  .extend({
    responsible: z.string().trim().min(3, 'Nome de quem responde pela ONG'),
    password: passwordSchema,
    confirm: z.string(),
    lgpdConsent: z.literal(true, { errorMap: () => ({ message: 'É preciso aceitar os termos' }) }),
  })
  .refine((d) => d.password === d.confirm, { path: ['confirm'], message: 'As senhas não conferem' });

type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;

export function OngSignupPage() {
  useDocumentMeta({ title: 'Cadastrar ONG', description: 'Cadastre sua ONG no PetLink e publique seus animais para adoção responsável.' });
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<In, unknown, Out>({ resolver: zodResolver(schema), mode: 'onTouched' });

  const onSubmit = handleSubmit(async ({ confirm: _c, lgpdConsent: _l, ...d }) => {
    setError('');
    try {
      await signUpOng({ ...d, cnpj: formatCnpj(d.cnpj) });
      await refresh();
      toast.success('Cadastro enviado! A equipe PetLink vai validar o CNPJ em até 2 dias úteis.');
      navigate('/ong/painel', { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    }
  });

  return (
    <AuthLayout title="Cadastre sua ONG" script="Vamos encontrar lares juntos" wide>
      <p className="-mt-4 mb-6 text-text">
        Depois do cadastro, nossa equipe confere o CNPJ. Enquanto isso, você já pode cadastrar os animais; eles aparecem no catálogo depois da
        aprovação.
      </p>
      <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        {error && (
          <p role="alert" className="rounded-card bg-danger-soft p-3 text-sm font-medium text-danger sm:col-span-2">
            {error}
          </p>
        )}
        <Input label="Nome da ONG" required error={errors.name?.message} {...register('name')} />
        <Input
          label="CNPJ"
          required
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          error={errors.cnpj?.message}
          {...register('cnpj', { onChange: (e) => setValue('cnpj', formatCnpj(e.target.value)) })}
        />
        <Input label="Responsável" required autoComplete="name" error={errors.responsible?.message} {...register('responsible')} />
        <Input label="Telefone / WhatsApp" type="tel" required error={errors.phone?.message} {...register('phone')} />
        <Input label="Endereço" required className="sm:col-span-2" placeholder="Rua, número - bairro" error={errors.address?.message} {...register('address')} />
        <Input label="Cidade" required error={errors.city?.message} {...register('city')} />
        <Select label="UF" required options={UF} placeholder="Escolha" error={errors.state?.message} {...register('state')} />
        <Textarea label="Sobre a ONG" required className="sm:col-span-2" rows={4} hint="O que vocês fazem, há quanto tempo e como cuidam dos animais." error={errors.description?.message} {...register('description')} />
        <Input label="E-mail de acesso" type="email" autoComplete="email" required error={errors.email?.message} {...register('email')} />
        <div className="hidden sm:block" />
        <Input label="Senha" type="password" autoComplete="new-password" required hint="Mínimo 8 caracteres, com letra e número." error={errors.password?.message} {...register('password')} />
        <Input label="Confirme a senha" type="password" autoComplete="new-password" required error={errors.confirm?.message} {...register('confirm')} />
        <Checkbox className="sm:col-span-2" label="Declaro que as informações são verdadeiras e concordo com os termos de uso e a política de privacidade." error={errors.lgpdConsent?.message} {...register('lgpdConsent')} />
        <Button type="submit" size="lg" arrow loading={isSubmitting} className="sm:col-span-2 sm:justify-self-start">
          Enviar cadastro
        </Button>
      </form>
      <p className="mt-6 text-sm">
        Já tem cadastro?{' '}
        <Link to="/entrar" className="font-semibold text-primary underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
