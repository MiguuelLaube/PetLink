import { useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { z } from 'zod';
import { Mail, MessageCircle } from 'lucide-react';
import { contactSchema } from '@/schemas';
import { sendContactMessage } from '@/services/content';
import { friendlyError } from '@/services/helpers';
import { useDocumentMeta } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';

const SUBJECTS: Record<string, string> = { voluntariado: 'Quero ser voluntário(a). Tenho disponibilidade em: ' };

export function ContactPage() {
  useDocumentMeta({ title: 'Contato' });
  const [params] = useSearchParams();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { message: SUBJECTS[params.get('assunto') ?? ''] ?? '' },
  });
  const send = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => { toast.success('Mensagem enviada! Respondemos em até 3 dias úteis.'); reset({ name: '', email: '', message: '' }); },
    onError: (e) => toast.error(friendlyError(e)),
  });
  return (
    <>
      <PageHeader title="Fale com a gente" script="Dúvidas, ideias e voluntariado">
        Para falar sobre um animal específico, use o contato da ONG responsável na ficha dele.
      </PageHeader>
      <div className="container-page grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <form noValidate onSubmit={handleSubmit((d) => send.mutate(d))} className="grid gap-4 rounded-block bg-white/80 p-6 shadow-warm sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nome" required autoComplete="name" error={errors.name?.message} {...register('name')} />
            <Input label="E-mail" type="email" required autoComplete="email" error={errors.email?.message} {...register('email')} />
          </div>
          <Textarea label="Mensagem" required rows={6} error={errors.message?.message} {...register('message')} />
          <Button type="submit" arrow loading={send.isPending} className="justify-self-start">Enviar mensagem</Button>
        </form>
        <aside className="grid content-start gap-4">
          <a href="mailto:contato@petlink.org" className="flex items-center gap-3 rounded-card bg-yellow-soft p-5 font-semibold text-primary"><Mail aria-hidden className="size-5" /> contato@petlink.org</a>
          <div className="flex items-start gap-3 rounded-card bg-blue-soft p-5 text-sm">
            <MessageCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
            <p>Viu maus-tratos? Denuncie na delegacia ou pelo Disque Denúncia do seu estado. Maus-tratos a animais são crime (Lei 9.605/98).</p>
          </div>
        </aside>
      </div>
    </>
  );
}
