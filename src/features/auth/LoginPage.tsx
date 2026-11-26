import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '@/schemas';
import { requestPasswordReset, signIn } from '@/services/auth';
import { getProfile } from '@/services/users';
import { friendlyError } from '@/services/helpers';
import { useDocumentMeta } from '@/lib/seo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { AuthLayout } from './AuthLayout';
import { homeFor } from './RequireRole';

export function LoginPage() {
  useDocumentMeta({ title: 'Entrar' });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError('');
    try {
      const cred = await signIn(email, password);
      const profile = await getProfile(cred.user.uid);
      const back = params.get('voltar');
      navigate(back && back.startsWith('/') ? back : homeFor(profile?.role), { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    }
  });

  const reset = async () => {
    const email = getValues('email');
    if (!email) return setError('Digite seu e-mail acima para receber o link de redefinição.');
    try {
      await requestPasswordReset(email);
      toast.success('Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha.');
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  return (
    <AuthLayout title="Que bom te ver" script="Entre para acompanhar suas adoções">
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        {error && (
          <p role="alert" className="rounded-card bg-danger-soft p-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}
        <Input label="E-mail" type="email" autoComplete="email" required error={errors.email?.message} {...register('email')} />
        <Input label="Senha" type="password" autoComplete="current-password" required error={errors.password?.message} {...register('password')} />
        <button type="button" onClick={reset} className="justify-self-start text-sm font-semibold text-primary underline underline-offset-4">
          Esqueci minha senha
        </button>
        <Button type="submit" size="lg" arrow loading={isSubmitting} className="mt-2">
          Entrar
        </Button>
      </form>
      <div className="mt-8 grid gap-2 border-t border-line pt-6 text-sm">
        <p>
          Ainda não tem conta?{' '}
          <Link to={`/cadastro${params.get('voltar') ? `?voltar=${encodeURIComponent(params.get('voltar')!)}` : ''}`} className="font-semibold text-primary underline">
            Cadastre-se para adotar
          </Link>
        </p>
        <p>
          É uma ONG?{' '}
          <Link to="/cadastro-ong" className="font-semibold text-primary underline">
            Cadastre sua organização
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
