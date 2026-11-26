import { useEffect, useMemo } from 'react';
import { ImagePlus, X } from 'lucide-react';

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
  max: number;
  existing?: string[];
  onRemoveExisting?: (url: string) => void;
  label?: string;
}

/** Seleção de fotos com pré-visualização (até `max`, 5 MB cada). */
export function PhotoPicker({ files, onChange, max, existing = [], onRemoveExisting, label = 'Fotos' }: Props) {
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);
  const total = existing.length + files.length;

  const add = (list: FileList | null) => {
    if (!list) return;
    const ok = [...list].filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    onChange([...files, ...ok].slice(0, Math.max(0, max - existing.length)));
  };

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">
        {label} <span className="text-text-muted">({total}/{max}, até 5 MB cada; a primeira é a principal)</span>
      </legend>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {existing.map((url, i) => (
          <li key={url} className="relative aspect-square overflow-hidden rounded-card bg-peach-soft">
            <img src={url} alt={`Foto ${i + 1}`} className="size-full object-cover" />
            {onRemoveExisting && (
              <button type="button" onClick={() => onRemoveExisting(url)} aria-label={`Remover foto ${i + 1}`} className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-primary text-cream">
                <X className="size-4" />
              </button>
            )}
          </li>
        ))}
        {previews.map((url, i) => (
          <li key={url} className="relative aspect-square overflow-hidden rounded-card bg-peach-soft">
            <img src={url} alt={`Nova foto ${i + 1}`} className="size-full object-cover" />
            <button type="button" onClick={() => onChange(files.filter((_, j) => j !== i))} aria-label={`Remover nova foto ${i + 1}`} className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-primary text-cream">
              <X className="size-4" />
            </button>
          </li>
        ))}
        {total < max && (
          <li>
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-card border-2 border-dashed border-line bg-white text-xs font-semibold text-primary hover:border-primary focus-within:outline focus-within:outline-3 focus-within:outline-orange">
              <ImagePlus aria-hidden className="size-6" />
              Adicionar
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
            </label>
          </li>
        )}
      </ul>
    </fieldset>
  );
}
