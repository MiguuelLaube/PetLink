import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { adoptionQuestionnaireSchema, HOURS_ALONE, HOUSING, VISIT_PREF, type AdoptionQuestionnaire as Form, type Pet, type UserProfile } from '@/schemas';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Checkbox, Input, Select, Textarea } from '@/components/ui/Field';
import { ADOPTION_TERMS } from '@/components/pets/AdoptionSteps';
import { Stepper } from './Stepper';

const STEPS = ['Contato', 'Sua casa', 'Rotina', 'Termos'];
const FIELDS: Array<Array<keyof Form & string>> = [
  ['requesterName', 'email', 'phone'],
  ['housingType', 'housingSafe', 'hasOtherPets', 'hasChildrenOrElderly'],
  ['hoursAlone', 'visitPreference', 'notes'],
  ['acceptTerms', 'lgpdConsent'],
];

interface Props {
  open: boolean;
  onClose: () => void;
  pet: Pet;
  profile: UserProfile;
  onSubmit: (data: Form) => Promise<unknown>;
}

export function AdoptionQuestionnaire({ open, onClose, pet, profile, onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof adoptionQuestionnaireSchema>, unknown, Form>({
    resolver: zodResolver(adoptionQuestionnaireSchema),
    defaultValues: { requesterName: profile.name, email: profile.email, phone: profile.phone ?? '', notes: '' },
    mode: 'onTouched',
  });

  const next = async () => {
    if (await trigger(FIELDS[step])) setStep((s) => s + 1);
  };

  const submit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      toast.success(`Pedido enviado! A ONG ${pet.ongName} vai analisar e você acompanha tudo em Minha conta.`);
      setStep(0);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível enviar. Tente de novo.');
    }
  });

  const last = step === STEPS.length - 1;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Quero adotar ${pet.name}`}
      description="Leva uns 3 minutos. Suas respostas vão só para a ONG responsável."
      size="lg"
      footer={
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={() => (step ? setStep(step - 1) : onClose())}>
            {step ? 'Voltar' : 'Cancelar'}
          </Button>
          {last ? (
            <Button type="submit" form="form-adocao" loading={isSubmitting} arrow>
              Enviar pedido
            </Button>
          ) : (
            <Button onClick={next} arrow>
              Continuar
            </Button>
          )}
        </div>
      }
    >
      <Stepper steps={STEPS} current={step} />
      <form id="form-adocao" onSubmit={submit} noValidate className="grid gap-4">
        {step === 0 && (
          <>
            <Input label="Nome completo" required autoComplete="name" error={errors.requesterName?.message} {...register('requesterName')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="E-mail" type="email" required autoComplete="email" error={errors.email?.message} {...register('email')} />
              <Input label="Telefone / WhatsApp" type="tel" required autoComplete="tel" placeholder="(11) 98765-4321" error={errors.phone?.message} {...register('phone')} />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Tipo de moradia" required options={HOUSING} placeholder="Escolha" error={errors.housingType?.message} {...register('housingType')} />
              <Select label="Janelas teladas e portões seguros?" required options={['Sim', 'Não', 'Vou adaptar']} placeholder="Escolha" error={errors.housingSafe?.message} {...register('housingSafe')} />
            </div>
            <Textarea label="Há outros animais em casa?" required rows={2} hint="Espécie, idade e se são castrados e vacinados." error={errors.hasOtherPets?.message} {...register('hasOtherPets')} />
            <Textarea label="Moram crianças ou idosos com você?" required rows={2} error={errors.hasChildrenOrElderly?.message} {...register('hasChildrenOrElderly')} />
          </>
        )}
        {step === 2 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label={`Quanto tempo ${pet.name} ficaria sozinho(a) por dia?`} required options={HOURS_ALONE} placeholder="Escolha" error={errors.hoursAlone?.message} {...register('hoursAlone')} />
              <Select label="Melhor horário para a visita" required options={VISIT_PREF} placeholder="Escolha" error={errors.visitPreference?.message} {...register('visitPreference')} />
            </div>
            <Textarea label="Quer contar mais alguma coisa?" rows={4} hint="Opcional. Ex.: experiência com animais, rotina de passeios." error={errors.notes?.message} {...register('notes')} />
          </>
        )}
        {step === 3 && (
          <>
            <div className="rounded-card bg-white p-4">
              <p className="font-semibold text-primary">Termo de adoção responsável</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text">
                {ADOPTION_TERMS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <Checkbox label="Li e aceito os termos de adoção responsável." error={errors.acceptTerms?.message} {...register('acceptTerms')} />
            <Checkbox
              label={
                <>
                  Autorizo o PetLink a compartilhar estas respostas com a ONG {pet.ongName} só para a análise da adoção, conforme a LGPD.{' '}
                  <Link to="/faq#privacidade" className="font-semibold text-primary underline" target="_blank">
                    Saiba mais
                  </Link>
                </>
              }
              error={errors.lgpdConsent?.message}
              {...register('lgpdConsent')}
            />
          </>
        )}
      </form>
    </Modal>
  );
}
