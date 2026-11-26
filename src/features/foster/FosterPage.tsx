import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HeartPulse, PhoneCall, ShieldCheck } from 'lucide-react';
import { fosterInputSchema, UF, type FosterInput } from '@/schemas';
import { createFosterRequest } from '@/services/foster';
import { friendlyError } from '@/services/helpers';
import { useDocumentMeta } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Checkbox, Input, Select, Textarea } from '@/components/ui/Field';
import { PhotoPicker } from '@/components/forms/PhotoPicker';
import { useAuth } from '@/features/auth/AuthContext';

const TIPS = [
  { icon: ShieldCheck, title: 'Segurança primeiro', text: 'Aproxime-se devagar. Se o animal estiver ferido ou assustado, não force o contato.' },
  { icon: HeartPulse, title: 'Água e abrigo', text: 'Ofereça água e um lugar protegido enquanto aguarda a resposta das ONGs.' },
  { icon: PhoneCall, title: 'Emergência?', text: 'Atropelamento ou sangramento: procure um veterinário 24h antes de preencher o formulário.' },
];

export function FosterPage() {
  useDocumentMeta({ title: 'Lar temporário e resgate', description: 'Encontrou um animal precisando de ajuda? Avise as ONGs parceiras do PetLink.' });
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [photos, setPhotos] = useState<File[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FosterInput>({
    resolver: zodResolver(fosterInputSchema),
    defaultValues: { phone: profile?.phone ?? '' },
  });

  const send = useMutation({
    mutationFn: (d: FosterInput) => createFosterRequest(d, photos, { uid: user!.uid, name: profile!.name, email: profile!.email }),
    onSuccess: () => {
      toast.success('Relato enviado! As ONGs parceiras foram avisadas. Acompanhe em Minha conta.');
      qc.invalidateQueries({ queryKey: ['foster'] });
      reset();
      setPhotos([]);
      navigate('/minha-conta?aba=lar-temporario');
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  const canSend = user && profile?.role === 'user';

  return (
    <>
      <PageHeader title="Lar temporário e resgate" stamp="Salve uma vida" script="Às vezes, um abrigo por uns dias muda tudo">
        Encontrou um cão ou gato na rua, ou precisa de ajuda com um resgate? Conte para as ONGs parceiras. Quem puder acolher entra em contato
        com você.
      </PageHeader>
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="form-resgate" className="rounded-block bg-white/80 p-6 shadow-warm sm:p-8">
          <h2 id="form-resgate" className="text-h2">Relatar um animal</h2>
          {!canSend ? (
            <div className="mt-6 rounded-card bg-peach-soft p-5">
              <p className="font-medium">
                {user ? 'O relato é feito por contas de adotante/voluntário.' : 'Para enviar o relato, entre na sua conta. Assim as ONGs conseguem responder e você acompanha o andamento.'}
              </p>
              {!user && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <ButtonLink to="/entrar?voltar=/lar-temporario" arrow>Entrar</ButtonLink>
                  <ButtonLink to="/cadastro?voltar=/lar-temporario" variant="secondary">Criar conta</ButtonLink>
                </div>
              )}
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit((d) => send.mutate(d))} className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input label="Nome provisório" required placeholder="Ex.: Pretinha" error={errors.petName?.message} {...register('petName')} />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Espécie" required options={['Cachorro', 'Gato']} placeholder="Escolha" error={errors.species?.message} {...register('species')} />
                <Select label="Porte" required options={['Pequeno', 'Médio', 'Grande']} placeholder="Escolha" error={errors.size?.message} {...register('size')} />
              </div>
              <Input label="Cidade onde está" required error={errors.city?.message} {...register('city')} />
              <Select label="UF" required options={UF} placeholder="Escolha" error={errors.state?.message} {...register('state')} />
              <Textarea label="O que aconteceu?" required className="sm:col-span-2" rows={4} hint="Onde encontrou, estado de saúde, comportamento e se pode levá-lo até a ONG." error={errors.reason?.message} {...register('reason')} />
              <Input label="Telefone para contato" type="tel" required error={errors.phone?.message} {...register('phone')} />
              <div className="sm:col-span-2">
                <PhotoPicker files={photos} onChange={setPhotos} max={4} />
              </div>
              <Checkbox className="sm:col-span-2" label="Autorizo que as ONGs parceiras vejam este relato e entrem em contato comigo." error={errors.consent?.message} {...register('consent')} />
              <Button type="submit" size="lg" arrow loading={send.isPending} className="sm:col-span-2 sm:justify-self-start">
                Enviar relato
              </Button>
            </form>
          )}
        </section>
        <aside aria-label="Dicas rápidas" className="grid content-start gap-4">
          {TIPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-card bg-blue-soft p-5">
              <Icon aria-hidden className="size-6 text-primary" />
              <p className="mt-2 font-semibold text-primary">{title}</p>
              <p className="text-sm">{text}</p>
            </div>
          ))}
          <p className="text-sm text-text-muted">
            É uma ONG e quer acolher? <Link to="/cadastro-ong" className="font-semibold text-primary underline">Cadastre-se</Link>.
          </p>
        </aside>
      </div>
    </>
  );
}
