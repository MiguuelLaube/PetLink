import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/components/ui/cn';
import { CONTENT, type ContentKind } from './contentConfig';
import { ContentFormModal } from './ContentFormModal';
import { useContentList, useDeleteContent } from './hooks';

type Item = { id: string } & Record<string, string>;

export function ContentTab() {
  const [kind, setKind] = useState<ContentKind>('news');
  const cfg = CONTENT[kind];
  const list = useContentList(kind);
  const del = useDeleteContent(kind);
  const [editing, setEditing] = useState<Item | 'new' | null>(null);
  const [removing, setRemoving] = useState<Item | null>(null);
  const items = (list.data ?? []) as unknown as Item[];

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Tipo de conteúdo" className="flex rounded-full bg-white p-1 shadow-soft">
          {(Object.keys(CONTENT) as ContentKind[]).map((k) => (
            <button key={k} type="button" aria-pressed={k === kind} onClick={() => setKind(k)} className={cn('rounded-full px-4 py-2 text-sm font-semibold', k === kind ? 'bg-primary text-cream' : 'text-primary')}>
              {CONTENT[k].label}
            </button>
          ))}
        </div>
        <Button icon={<Plus className="size-4" />} onClick={() => setEditing('new')}>Nova {cfg.singular === 'parceiro' ? 'entrada' : cfg.singular}</Button>
      </div>
      {!items.length ? (
        <EmptyState title={`Nenhum(a) ${cfg.singular}`} text="Crie o primeiro item para ele aparecer no site." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-4 rounded-card bg-white p-4 shadow-soft">
              <img src={it.image} alt="" className="size-16 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-primary">{cfg.title(it)}</p>
                <p className="truncate text-xs text-text-muted">{cfg.sub(it)}</p>
              </div>
              <button type="button" onClick={() => setEditing(it)} aria-label={`Editar ${cfg.title(it)}`} className="grid size-10 place-items-center rounded-full text-primary hover:bg-peach"><Pencil className="size-4" /></button>
              <button type="button" onClick={() => setRemoving(it)} aria-label={`Excluir ${cfg.title(it)}`} className="grid size-10 place-items-center rounded-full text-danger hover:bg-danger-soft"><Trash2 className="size-4" /></button>
            </li>
          ))}
        </ul>
      )}
      {editing && <ContentFormModal key={`${kind}-${editing === 'new' ? 'new' : editing.id}`} kind={kind} item={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
      <ConfirmModal
        open={!!removing}
        onClose={() => setRemoving(null)}
        title="Excluir conteúdo?"
        confirmLabel="Excluir"
        danger
        loading={del.isPending}
        onConfirm={() => removing && del.mutate(removing.id, { onSuccess: () => setRemoving(null) })}
      >
        <p>“{removing ? cfg.title(removing) : ''}” sai do site imediatamente.</p>
      </ConfirmModal>
    </>
  );
}
