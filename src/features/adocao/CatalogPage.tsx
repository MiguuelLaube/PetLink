import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PetCard } from '@/components/pets/PetCard';
import { PetFilters } from '@/components/pets/PetFilters';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PetCardSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/components/ui/cn';
import { applyPetFilters, countActiveFilters, EMPTY_FILTERS, filtersFromParams, filtersToParams, type PetFilters as Filters } from '@/lib/filters';
import { useDebounce } from '@/lib/useDebounce';
import { useDocumentMeta } from '@/lib/seo';
import { readLocal, writeLocal } from '@/lib/storage';
import { useAvailablePets, useFavorites, useToggleFavorite } from './hooks';

const PAGE = 12;

export function CatalogPage() {
  useDocumentMeta({ title: 'Adote um cão ou gato', description: 'Filtre por espécie, porte, idade e cidade e encontre o animal que combina com você.' });
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const [search, setSearch] = useState(filters.q);
  const debounced = useDebounce(search, 300);
  const [layout, setLayout] = useState<'grid' | 'list'>(() => readLocal('petlink:layout', 'grid'));
  const [visible, setVisible] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);

  const pets = useAvailablePets();
  const favorites = useFavorites();
  const toggle = useToggleFavorite();

  const update = (f: Filters) => setParams(filtersToParams(f, params), { replace: true });
  useEffect(() => {
    if (debounced !== filters.q) update({ ...filters, q: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);
  useEffect(() => setVisible(PAGE), [params]);
  useEffect(() => writeLocal('petlink:layout', layout), [layout]);

  const result = useMemo(() => applyPetFilters(pets.data ?? [], filters, favorites), [pets.data, filters, favorites]);
  const active = countActiveFilters(filters);

  return (
    <>
      <PageHeader title="Encontre seu novo amigo" stamp="Seu novo amigo" script="Alguém está esperando por você">
        Todos os animais são acompanhados por ONGs verificadas. Use os filtros para achar quem combina com a sua casa e a sua rotina.
      </PageHeader>
      <div className="container-page grid gap-8 lg:grid-cols-[17rem_1fr]">
        <aside aria-label="Filtros" className="hidden lg:block">
          <div className="sticky top-24 rounded-block bg-white/70 p-6 shadow-soft">
            <PetFilters value={filters} onChange={update} />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1 basis-60">
              <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
              <label htmlFor="busca" className="sr-only">
                Buscar por nome ou raça
              </label>
              <input
                id="busca"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou raça"
                className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 focus:border-primary focus:outline-none"
              />
            </div>
            <Button variant="secondary" className="lg:hidden" icon={<SlidersHorizontal className="size-4" />} onClick={() => setDrawer(true)}>
              Filtros{active ? ` (${active})` : ''}
            </Button>
            <label className="sr-only" htmlFor="ordem">
              Ordenar
            </label>
            <select
              id="ordem"
              value={filters.ordem}
              onChange={(e) => update({ ...filters, ordem: e.target.value as Filters['ordem'] })}
              className="h-11 rounded-full border border-line bg-white px-4 text-sm"
            >
              <option value="recentes">Chegaram há pouco</option>
              <option value="antigos">Há mais tempo no abrigo</option>
            </select>
            <div role="group" aria-label="Modo de exibição" className="flex rounded-full border border-line bg-white p-1">
              {(['grid', 'list'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={layout === m}
                  aria-label={m === 'grid' ? 'Grade' : 'Lista'}
                  onClick={() => setLayout(m)}
                  className={cn('grid size-9 place-items-center rounded-full', layout === m ? 'bg-primary text-cream' : 'text-primary')}
                >
                  {m === 'grid' ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
                </button>
              ))}
            </div>
          </div>

          <p aria-live="polite" className="mt-4 text-sm text-text-muted">
            {pets.isLoading ? 'Carregando animais…' : `${result.length} ${result.length === 1 ? 'animal encontrado' : 'animais encontrados'}`}
          </p>

          <div className={cn('mt-4 grid gap-5', layout === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
            {pets.isError ? (
              <div className="col-span-full">
                <ErrorState onRetry={() => pets.refetch()} />
              </div>
            ) : pets.isLoading ? (
              Array.from({ length: 6 }, (_, i) => <PetCardSkeleton key={i} />)
            ) : result.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  title="Nenhum animal com esses filtros"
                  text={filters.favoritos ? 'Você ainda não favoritou nenhum animal com essas características.' : 'Tente tirar algum filtro ou buscar em outra cidade.'}
                  action={<Button variant="secondary" onClick={() => { setSearch(''); update(EMPTY_FILTERS); }}>Limpar tudo</Button>}
                />
              </div>
            ) : (
              result.slice(0, visible).map((p, i) => (
                <PetCard
                  key={p.id}
                  pet={p}
                  index={i}
                  layout={layout}
                  favorite={favorites.has(p.id)}
                  onToggleFavorite={(on) => toggle.mutate({ petId: p.id, on })}
                />
              ))
            )}
          </div>
          {result.length > visible && (
            <div className="mt-10 flex justify-center">
              <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE)}>
                Carregar mais ({result.length - visible})
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal open={drawer} onClose={() => setDrawer(false)} title="Filtros" footer={<Button className="w-full" onClick={() => setDrawer(false)}>Ver {result.length} animais</Button>}>
        <PetFilters value={filters} onChange={update} />
      </Modal>
    </>
  );
}
