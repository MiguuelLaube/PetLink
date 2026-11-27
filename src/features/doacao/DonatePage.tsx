import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import type { z } from 'zod';
import { donationSchema, sponsorLeadSchema } from '@/schemas';
import { registerDonation, sendSponsorLead } from '@/services/content';
import { friendlyError } from '@/services/helpers';
import { brl } from '@/lib/format';
import { useDocumentMeta } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import { cn } from '@/components/ui/cn';
import { PartnersCarousel } from '@/components/sections/PartnersCarousel';
import { usePartners } from '@/features/institucional/hooks';

const PRESETS = [
  { value: 10, text: 'Uma semana de ração para um filhote' },
  { value: 25, text: 'Check-up veterinário e uma vacina' },
  { value: 50, text: 'Um mês de lar temporário' },
];

export function DonatePage() {
  useDocumentMeta({ title: 'Doe para as ONGs', description: 'Doe R$ 10, R$ 25, R$ 50 ou o valor que puder para manter cães e gatos resgatados.' });
  const [params] = useSearchParams();
  const initial = Number(params.get('valor')) || 25;
  const [amount, setAmount] = useState<number>(initial);
  const [custom, setCustom] = useState(PRESETS.some((p) => p.value === initial) ? '' : String(initial));
  const [frequency, setFrequency] = useState<'unica' | 'mensal'>('unica');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState<number | null>(null);
  const partners = usePartners();

  const donate = useMutation({
    mutationFn: () => {
      const parsed = donationSchema.parse({ amount: custom ? Number(custom.replace(',', '.')) : amount, frequency, name, email });
      return registerDonation(parsed).then(() => parsed.amount);
    },
    onSuccess: (v) => setDone(v),
    onError: (e) => toast.error(e instanceof Error && 'issues' in e ? (e as z.ZodError).issues[0].message : friendlyError(e)),
  });

  const lead = useForm<z.infer<typeof sponsorLeadSchema>>({ resolver: zodResolver(sponsorLeadSchema) });
  const sendLead = useMutation({
    mutationFn: sendSponsorLead,
    onSuccess: () => { toast.success('Recebemos seu contato! Respondemos em até 3 dias úteis.'); lead.reset(); },
    onError: (e) => toast.error(friendlyError(e)),
  });

  return (
    <>
      <PageHeader title="Você também pode ajudar" stamp="Ajude-os" script="Cada real vira cuidado">
        As doações são repassadas às ONGs parceiras para ração, vacinas, castrações e lares temporários.
      </PageHeader>
      <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section aria-labelledby="doar" className="rounded-block bg-white/80 p-6 shadow-warm sm:p-8">
          <h2 id="doar" className="text-h2">Faça sua doação</h2>
          {done ? (
            <div role="status" className="mt-6 rounded-card bg-success-soft p-6 text-success">
              <CheckCircle2 aria-hidden className="size-8" />
              <p className="mt-2 text-lg font-semibold">Obrigado! Doação de {brl(done)} registrada.</p>
              <p className="mt-1 text-sm text-text">Este ambiente é de demonstração: nenhum valor foi cobrado.</p>
              <Button variant="secondary" className="mt-4" onClick={() => setDone(null)}>Fazer outra doação</Button>
            </div>
          ) : (
            <form className="mt-6 grid gap-5" onSubmit={(e) => { e.preventDefault(); donate.mutate(); }}>
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-primary">Valor</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {PRESETS.map((p, i) => {
                    const on = !custom && amount === p.value;
                    return (
                      <button key={p.value} type="button" aria-pressed={on} onClick={() => { setAmount(p.value); setCustom(''); }}
                        className={cn('rounded-card p-4 text-left transition', ['bg-yellow', 'bg-peach', 'bg-blue'][i], on ? 'ring-4 ring-primary' : 'opacity-85 hover:opacity-100')}>
                        <span className="font-display text-4xl leading-none text-primary">R$ {p.value}</span>
                        <span className="mt-1 block text-xs font-medium text-primary">{p.text}</span>
                      </button>
                    );
                  })}
                </div>
                <Input className="mt-3 max-w-xs" label="Outro valor (R$)" inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d,.]/g, ''))} placeholder="Ex.: 80" />
              </fieldset>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-primary">Frequência</legend>
                <div className="flex gap-2">
                  {(['unica', 'mensal'] as const).map((f) => (
                    <button key={f} type="button" aria-pressed={frequency === f} onClick={() => setFrequency(f)}
                      className={cn('min-h-10 rounded-full px-5 text-sm font-semibold', frequency === f ? 'bg-primary text-cream' : 'bg-white text-primary ring-1 ring-line')}>
                      {f === 'unica' ? 'Única' : 'Mensal'}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Seu nome (opcional)" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                <Input label="E-mail para o recibo (opcional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <p className="rounded-card bg-warning-soft p-3 text-xs text-warning">Pagamento simulado: a integração com Pix, Mercado Pago ou Stripe ainda não está ativa.</p>
              <Button type="submit" size="lg" arrow loading={donate.isPending} className="justify-self-start">
                Doar {brl(custom ? Number(custom.replace(',', '.')) || 0 : amount)}{frequency === 'mensal' ? ' por mês' : ''}
              </Button>
            </form>
          )}
        </section>
        <section id="patrocinio" aria-labelledby="patrocinador" className="scroll-mt-24 rounded-block bg-peach p-6 sm:p-8">
          <h2 id="patrocinador" className="text-h2">Seja um patrocinador</h2>
          <p className="mt-2 text-sm">Clínicas, pet shops e marcas podem oferecer benefícios para quem adota e apoiar as ONGs.</p>
          <form noValidate onSubmit={lead.handleSubmit((d) => sendLead.mutate(d))} className="mt-5 grid gap-4">
            <Input label="Empresa" required error={lead.formState.errors.name?.message} {...lead.register('name')} />
            <Input label="E-mail" type="email" required error={lead.formState.errors.email?.message} {...lead.register('email')} />
            <Textarea label="Como quer apoiar?" required rows={4} error={lead.formState.errors.message?.message} {...lead.register('message')} />
            <Button type="submit" loading={sendLead.isPending} className="justify-self-start">Quero patrocinar</Button>
          </form>
        </section>
      </div>
      <section aria-labelledby="parceiros" className="container-page mt-16">
        <h2 id="parceiros" className="text-h1">Nossos parceiros</h2>
        <div className="mt-6"><PartnersCarousel partners={partners.data ?? []} /></div>
      </section>
    </>
  );
}
