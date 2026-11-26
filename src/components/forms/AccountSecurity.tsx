import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { emailSchema, passwordSchema, phoneSchema, type UserProfile } from '@/schemas';
import { friendlyError } from '@/services/helpers';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { useChangeEmail, useChangePassword, useUpdateProfile } from '@/features/conta/hooks';

const dataSchema = z.object({ name: z.string().trim().min(3, 'Informe seu nome'), phone: phoneSchema });
const pwSchema = z
  .object({ current: z.string().min(1, 'Informe a senha atual'), next: passwordSchema, confirm: z.string() })
  .refine((d) => d.next === d.confirm, { path: ['confirm'], message: 'As senhas não conferem' });
const mailSchema = z.object({ email: emailSchema, current: z.string().min(1, 'Informe a senha atual') });

function Card({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card bg-white p-6 shadow-soft">
      <h3 className="font-semibold text-primary">{title}</h3>
      <p className="mb-4 text-sm text-text-muted">{text}</p>
      {children}
    </section>
  );
}

/** Dados pessoais, troca de senha e de e-mail (com reautenticação). */
export function AccountSecurity({ profile }: { profile: UserProfile }) {
  const upd = useUpdateProfile();
  const pw = useChangePassword();
  const mail = useChangeEmail();
  const d = useForm<z.infer<typeof dataSchema>>({ resolver: zodResolver(dataSchema), defaultValues: { name: profile.name, phone: profile.phone ?? '' } });
  const p = useForm<z.infer<typeof pwSchema>>({ resolver: zodResolver(pwSchema) });
  const m = useForm<z.infer<typeof mailSchema>>({ resolver: zodResolver(mailSchema) });

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card title="Dados pessoais" text="Usados para a ONG entrar em contato.">
        <form noValidate onSubmit={d.handleSubmit((v) => upd.mutate(v))} className="grid gap-3">
          <Input label="Nome" error={d.formState.errors.name?.message} {...d.register('name')} />
          <Input label="Telefone" type="tel" error={d.formState.errors.phone?.message} {...d.register('phone')} />
          <Button type="submit" size="sm" loading={upd.isPending} className="justify-self-start">Salvar</Button>
        </form>
      </Card>
      <Card title="Trocar senha" text="Por segurança, confirme a senha atual.">
        <form
          noValidate
          onSubmit={p.handleSubmit((v) =>
            pw.mutate(v, {
              onSuccess: () => { toast.success('Senha alterada.'); p.reset(); },
              onError: (e) => toast.error(friendlyError(e)),
            }),
          )}
          className="grid gap-3"
        >
          <Input label="Senha atual" type="password" autoComplete="current-password" error={p.formState.errors.current?.message} {...p.register('current')} />
          <Input label="Nova senha" type="password" autoComplete="new-password" error={p.formState.errors.next?.message} {...p.register('next')} />
          <Input label="Confirme a nova senha" type="password" autoComplete="new-password" error={p.formState.errors.confirm?.message} {...p.register('confirm')} />
          <Button type="submit" size="sm" loading={pw.isPending} className="justify-self-start">Alterar senha</Button>
        </form>
      </Card>
      <Card title="Trocar e-mail" text={`Atual: ${profile.email}. Enviaremos um link de confirmação para o novo endereço.`}>
        <form
          noValidate
          onSubmit={m.handleSubmit((v) =>
            mail.mutate(v, {
              onSuccess: () => { toast.success('Enviamos um link de confirmação para o novo e-mail.'); m.reset(); },
              onError: (e) => toast.error(friendlyError(e)),
            }),
          )}
          className="grid gap-3"
        >
          <Input label="Novo e-mail" type="email" autoComplete="email" error={m.formState.errors.email?.message} {...m.register('email')} />
          <Input label="Senha atual" type="password" autoComplete="current-password" error={m.formState.errors.current?.message} {...m.register('current')} />
          <Button type="submit" size="sm" loading={mail.isPending} className="justify-self-start">Enviar link</Button>
        </form>
      </Card>
    </div>
  );
}
