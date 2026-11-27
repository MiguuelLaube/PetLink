import { useState } from 'react';
import { Link } from 'react-router';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { PET_STATUS, type Ong, type Pet } from '@/schemas';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PetForm } from '@/components/forms/pet/PetForm';
import { PUBLICATION_LABEL } from '@/lib/status';
import { useDeletePet, useSavePet, useSetPetStatus } from './hooks';

export function PetsTab({ pets, ong }: { pets: Pet[]; ong: Ong }) {
  const [editing, setEditing] = useState<Pet | 'new' | null>(null);
  const [removing, setRemoving] = useState<Pet | null>(null);
  const save = useSavePet();
  const setStatus = useSetPetStatus();
  const del = useDeletePet();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted">Todo pet novo ou editado fica <strong>Em análise</strong> até a aprovação da equipe PetLink.</p>
        <Button icon={<Plus className="size-4" />} onClick={() => setEditing('new')}>Cadastrar pet</Button>
      </div>
      {pets.length === 0 ? (
        <EmptyState title="Nenhum pet cadastrado" text="Cadastre o primeiro animal da ONG para ele aparecer no catálogo." />
      ) : (
        <ul className="grid gap-3">
          {pets.map((p) => {
            const pub = PUBLICATION_LABEL[p.statusPublicacao];
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-card bg-white p-4 shadow-soft">
                <img src={p.mainImage} alt="" className="size-16 rounded-xl object-cover" />
                <div className="min-w-40 flex-1">
                  <Link to={`/adocao/${p.id}`} className="font-semibold text-primary hover:underline">{p.name}</Link>
                  <p className="text-xs text-text-muted">{p.species} · {p.age} · {p.city}/{p.state}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Badge tone={pub.tone}>{pub.label}</Badge>
                    {p.statusPublicacao === 'recusado' && p.motivoRecusa && <span className="text-xs text-danger">Motivo: {p.motivoRecusa}</span>}
                  </div>
                </div>
                <label className="text-sm">
                  <span className="sr-only">Status de adoção de {p.name}</span>
                  <select
                    value={p.status}
                    onChange={(e) => setStatus.mutate({ id: p.id, status: e.target.value as Pet['status'] })}
                    className="h-10 rounded-full border border-line bg-white px-3"
                  >
                    {PET_STATUS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setEditing(p)} aria-label={`Editar ${p.name}`} className="grid size-10 place-items-center rounded-full text-primary hover:bg-peach">
                    <Pencil className="size-4" />
                  </button>
                  <button type="button" onClick={() => setRemoving(p)} aria-label={`Excluir ${p.name}`} className="grid size-10 place-items-center rounded-full text-danger hover:bg-danger-soft">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <PetForm
          key={editing === 'new' ? 'new' : editing.id}
          open
          onClose={() => setEditing(null)}
          pet={editing === 'new' ? undefined : editing}
          initial={{ city: ong.city, state: ong.state }}
          saving={save.isPending}
          onSave={(r) => save.mutateAsync({ ...r, petId: editing === 'new' ? undefined : editing.id })}
        />
      )}
      <ConfirmModal
        open={!!removing}
        onClose={() => setRemoving(null)}
        title={`Excluir ${removing?.name}?`}
        confirmLabel="Excluir"
        danger
        loading={del.isPending}
        onConfirm={() => removing && del.mutate(removing.id, { onSuccess: () => setRemoving(null) })}
      >
        <p>A ficha sai do catálogo e não pode ser recuperada. Se o animal foi adotado, prefira mudar o status para “Adotado”.</p>
      </ConfirmModal>
    </>
  );
}
