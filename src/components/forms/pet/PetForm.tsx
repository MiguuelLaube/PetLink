import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { Pet } from '@/schemas';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Stepper } from '@/components/forms/Stepper';
import { PhotoPicker } from '@/components/forms/PhotoPicker';
import { petFormSchema, STEP_FIELDS, type PetFormIn, type PetFormOut } from './types';
import { StepBasics } from './StepBasics';
import { StepHealth } from './StepHealth';
import { StepBehavior } from './StepBehavior';
import { StepReview } from './StepReview';

const STEPS = ['Dados', 'Saúde', 'Comportamento', 'Fotos', 'Revisão'];

interface PetFormResult {
  input: PetFormOut;
  existing: string[];
  files: File[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  pet?: Pet;
  initial?: Partial<PetFormIn>;
  initialPhotos?: string[];
  title?: string;
  saving: boolean;
  onSave: (r: PetFormResult) => Promise<unknown>;
}

const EMPTY: PetFormIn = {
  name: '', species: 'Cachorro', breed: 'SRD', age: '', ageGroup: 'Adulto', gender: 'Macho', size: 'Médio', color: '', city: '', state: 'SP',
  description: '', castrated: false, dataCastracao: '', microchip: '', specialNeeds: false, specialNeedsDetails: '',
  vacinas: [], vermifugacoes: [], exames: [], comportamento: { criancas: 'Não testado', outrosAnimais: 'Não testado', energia: 'Média' },
};

function fromPet(p: Pet): PetFormIn {
  const { id: _i, ongId: _o, ongName: _n, status: _s, statusPublicacao: _p, motivoRecusa: _m, originFosterId: _f, entryDate: _e, createdAt: _c, updatedAt: _u, mainImage: _mi, galleryImages: _g, ...rest } = p;
  return { ...EMPTY, ...rest };
}

export function PetForm({ open, onClose, pet, initial, initialPhotos, title, saving, onSave }: Props) {
  const [step, setStep] = useState(0);
  const [existing, setExisting] = useState<string[]>(pet ? [pet.mainImage, ...(pet.galleryImages ?? [])] : initialPhotos ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<PetFormIn, unknown, PetFormOut>({
    resolver: zodResolver(petFormSchema),
    defaultValues: pet ? fromPet(pet) : { ...EMPTY, ...initial },
    mode: 'onTouched',
  });

  const next = async () => {
    if (step === 3 && existing.length + files.length === 0) return toast.error('Envie ao menos uma foto.');
    if (await form.trigger(STEP_FIELDS[step])) setStep((s) => s + 1);
  };

  const submit = form.handleSubmit(
    async (input) => {
      await onSave({ input, existing, files });
      onClose();
    },
    () => toast.error('Há campos para revisar nas etapas anteriores.'),
  );

  const last = step === STEPS.length - 1;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title ?? (pet ? `Editar ${pet.name}` : 'Cadastrar pet')}
      size="xl"
      footer={
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={() => (step ? setStep(step - 1) : onClose())}>{step ? 'Voltar' : 'Cancelar'}</Button>
          {last ? (
            <Button key="salvar" type="submit" form="form-pet" loading={saving} arrow>Salvar e enviar para análise</Button>
          ) : (
            <Button key="continuar" onClick={next} arrow>Continuar</Button>
          )}
        </div>
      }
    >
      <Stepper steps={STEPS} current={step} />
      <form id="form-pet" onSubmit={submit} noValidate>
        {step === 0 && <StepBasics form={form} />}
        {step === 1 && <StepHealth form={form} />}
        {step === 2 && <StepBehavior form={form} />}
        {step === 3 && (
          <PhotoPicker files={files} onChange={setFiles} max={6} existing={existing} onRemoveExisting={(u) => setExisting((e) => e.filter((x) => x !== u))} />
        )}
        {step === 4 && <StepReview form={form} photos={existing.length + files.length} />}
      </form>
    </Modal>
  );
}
