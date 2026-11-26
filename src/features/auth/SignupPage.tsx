import { Link, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { signupSchema, type SignupInput } from '@/schemas';
import { signUpAdopter } from '@/services/auth';
import { friendlyError } from '@/services/helpers';
import { useDocumentMeta } from '@/lib/seo';
import { Button } from '@/components/ui/Button';
import { Checkbox, Input } from '@/components/ui/Field';
import { AuthLayout } from './AuthLayout';
import { useAuth } from './AuthContext';

export function SignupPage() {
  useDocumentMeta({ title: 'Criar conta' });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupInput>({ resolver: zodResolver(signupSchema), mode: 'onTouched' });

  const onSubmit = handleSubmit(async (d) => {
    setError('');
    try {
      await signUpAdopter({ name: d.name, email: d.email, phone: d.phone, password: d.password });
      await refresh();
      toast.success('Conta criada! Bem-vindo(a) ao PetLink.');
      const back = params.get('voltar');
      navigate(back && back.startsWith('/') ? back : '/minha-conta', { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    }
  });

  return (
    <AuthLayout title="Crie sua conta" script="O primeiro passo para adotar">
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        {error && (
          <p role="alert" className="rounded-card bg-danger-soft p-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}
        <Input label="Nome completo" autoComplete="name" required error={errors.name?.message} {...register('name')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="E-mail" type="email" autoComplete="email" required error={errors.email?.message} {...register('email')} />
          <Input label="Telefone / WhatsApp" type="tel" autoComplete="tel" required placeholder="(11) 98765-4321" error={errors.phone?.message} {...register('phone')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Senha" type="password" autoComplete="new-password" required hint="Mínimo 8 caracteres, com letra e número." error={errors.password?.message} {...register('password')} />
          <Input label="Confirme a senha" type="password" autoComplete="new-password" required error={errors.confirm?.message} {...register('confirm')} />
        </div>
        <Checkbox
          label={
            <>
              Concordo com o uso dos meus dados para cadastro e adoção, conforme a{' '}
              <Link to="/faq#privacidade" className="font-semibold text-primary underline" target="_blank">
                política de privacidade
              </Link>
              .
            </>
          }
          error={errors.lgpdConsent?.message}
          {...register('lgpdConsent')}
        />
        <Button type="submit" size="lg" arrow loading={isSubmitting} className="mt-2">
          Criar conta
        </Button>
      </form>
      <p className="mt-6 text-sm">
        Já tem conta?{' '}
        <Link to="/entrar" className="font-semibold text-primary underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
