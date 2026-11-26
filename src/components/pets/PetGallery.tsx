import { useState } from 'react';
import { cn } from '@/components/ui/cn';

export function PetGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  return (
    <div>
      <div className="house-clip overflow-hidden bg-yellow-soft">
        <img src={current} alt={`Foto ${active + 1} de ${name}`} className="aspect-[4/4.3] w-full object-cover" />
      </div>
      {images.length > 1 && (
        <ul className="mt-4 flex gap-3" aria-label="Escolher foto">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === active}
                className={cn('size-16 overflow-hidden rounded-xl border-2 transition sm:size-20', i === active ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100')}
              >
                <img src={src} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
