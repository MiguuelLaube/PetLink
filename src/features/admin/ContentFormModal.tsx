import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import { todayIso } from '@/lib/dates';
import { CONTENT, type ContentKind } from './contentConfig';
import { useSaveContent } from './hooks';

export function ContentFormModal({ kind, item, onClose }: { kind: ContentKind; item?: { id: string } & Record<string, string>; onClose: () => void }) {
  const cfg = CONTENT[kind];
  const save = useSaveContent(kind);
  const defaults = Object.fromEntries(cfg.fields.map((f) => [f.name, item?.[f.name] ?? (f.type === 'date' ? todayIso() : '')]));
  const { register, handleSubmit, formState: { errors } } = useForm<Record<string, string>>({ resolver: zodResolver(cfg.schema as never) as unknown as Resolver<Record<string, string>>, defaultValues: defaults });
  const err = (n: string) => (errors[n]?.message as string | undefined) ?? (errors[n] ? 'Campo inválido' : undefined);

  return (
    <Modal
      open
      onClose={onClose}
      title={item ? `Editar ${cfg.singular}` : `Nova ${cfg.singular}`}
      size="lg"
      footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button type="submit" form="form-conteudo" loading={save.isPending}>Salvar</Button></div>}
    >
      <form
        id="form-conteudo"
        noValidate
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit((data) => save.mutate({ data: data as never, id: item?.id }, { onSuccess: onClose }))}
      >
        {cfg.fields.map((f) =>
          f.type === 'textarea' ? (
            <Textarea key={f.name} label={f.label} hint={f.hint} rows={f.name === 'body' ? 8 : 3} className="sm:col-span-2" error={err(f.name)} {...register(f.name)} />
          ) : (
            <Input key={f.name} label={f.label} hint={f.hint} type={f.type ?? 'text'} error={err(f.name)} {...register(f.name)} />
          ),
        )}
      </form>
    </Modal>
  );
}
